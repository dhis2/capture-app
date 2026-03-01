import log from 'loglevel';
import { errorCreator, pipe } from 'capture-core-utils';
import moment from 'moment';
import { dataElementTypes } from '../../../../../../metaData';
import { getApiOptionSetFilter } from './optionSet';

import {
    filterTypesObject,
    dateFilterTypes,
    type AssigneeFilterData,
    type DateFilterData,
    type DateTimeFilterData,
    type BooleanFilterData,
    type TextFilterData,
    type TimeFilterData,
    type NumericFilterData,
    type OrgUnitFilterData,
} from '../../../../WorkingListsBase';
import type {
    ApiDataFilterNumeric,
    ApiDataFilterText,
    ApiDataFilterOrgUnit,
    ApiDataFilterBoolean,
    ApiDataFilterTrueOnly,
    ApiDataFilterDate,
    ApiDataFilterAssignee,
    ApiEventQueryCriteria,
} from '../../../types';
import { toApiEmptyValueFilter } from '../../../../../FiltersForTypes/EmptyValue';

type ColumnForConverterBase = {
    id: string,
    type: typeof dataElementTypes[keyof typeof dataElementTypes],
    visible: boolean,
};
type MetadataColumnForConverter = ColumnForConverterBase;

type MainColumnForConverter = ColumnForConverterBase & {
    isMainProperty: true,
    apiName?: string,
};

type ColumnForConverter = MetadataColumnForConverter | MainColumnForConverter;


type ColumnsForConverter = Map<string, ColumnForConverter>;

const getTextFilter = (filter: TextFilterData): ApiDataFilterText => ({
    like: filter.value,
});

const getOrgUnitFilter = (filter: OrgUnitFilterData): ApiDataFilterOrgUnit => ({
    eq: filter.value,
});

const getNumericFilter = (filter: NumericFilterData): ApiDataFilterNumeric => ({
    ge: filter.ge ? filter.ge.toString() : undefined,
    le: filter.le ? filter.le.toString() : undefined,
});

const getTimeFilter = (filter: TimeFilterData): ApiDataFilterNumeric => ({
    ge: filter.ge ?? undefined,
    le: filter.le ?? undefined,
});

const getBooleanFilter = (filter: BooleanFilterData): ApiDataFilterBoolean => ({
    in: filter.values.map(value => (value ? 'true' : 'false')),
});

const getTrueOnlyFilter = (): ApiDataFilterTrueOnly => ({
    eq: 'true',
});

const convertDate = (rawValue: string): string => {
    const momentDate = moment(rawValue);
    momentDate.locale('en');
    return momentDate.format('YYYY-MM-DD');
};

const getDateFilter = (dateFilter: DateFilterData): ApiDataFilterDate => {
    const apiDateFilterContents = dateFilter.type === dateFilterTypes.RELATIVE ? {
        type: dateFilter.type,
        period: dateFilter.period,
        startBuffer: dateFilter.startBuffer,
        endBuffer: dateFilter.endBuffer,
    } : {
        type: dateFilter.type,
        startDate: dateFilter.ge ? convertDate(dateFilter.ge) : undefined,
        endDate: dateFilter.le ? convertDate(dateFilter.le) : undefined,
    };

    return {
        dateFilter: apiDateFilterContents,
    };
};

const getDateTimeFilter = (dateFilter: DateTimeFilterData): ApiDataFilterDate => ({
    dateFilter: {
        type: dateFilterTypes.ABSOLUTE,
        startDate: dateFilter.ge ?? undefined,
        endDate: dateFilter.le ?? undefined,
    },
});

const getAssigneeFilter = (filter: AssigneeFilterData): ApiDataFilterAssignee => ({
    assignedUserMode: filter.assignedUserMode,
    assignedUsers: filter.assignedUser ? [filter.assignedUser.id] : undefined,
});

const getFilterByType = {
    [filterTypesObject.AGE]: getDateFilter,
    [filterTypesObject.ASSIGNEE]: getAssigneeFilter,
    [filterTypesObject.BOOLEAN]: getBooleanFilter,
    [filterTypesObject.COORDINATE]: getTextFilter,
    [filterTypesObject.DATE]: getDateFilter,
    [filterTypesObject.DATETIME]: getDateTimeFilter,
    [filterTypesObject.EMAIL]: getTextFilter,
    [filterTypesObject.FILE_RESOURCE]: getTextFilter,
    [filterTypesObject.IMAGE]: getTextFilter,
    [filterTypesObject.INTEGER]: getNumericFilter,
    [filterTypesObject.INTEGER_NEGATIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_POSITIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: getNumericFilter,
    [filterTypesObject.LONG_TEXT]: getTextFilter,
    [filterTypesObject.NUMBER]: getNumericFilter,
    [filterTypesObject.ORGANISATION_UNIT]: getOrgUnitFilter,
    [filterTypesObject.PERCENTAGE]: getNumericFilter,
    [filterTypesObject.PHONE_NUMBER]: getTextFilter,
    [filterTypesObject.TEXT]: getTextFilter,
    [filterTypesObject.TIME]: getTimeFilter,
    [filterTypesObject.TRUE_ONLY]: getTrueOnlyFilter,
    [filterTypesObject.URL]: getTextFilter,
    [filterTypesObject.USERNAME]: getTextFilter,
};

const typeConvertFilters = (filters: any, columns: ColumnsForConverter) => Object
    .keys(filters)
    .map((key) => {
        const filter = filters[key];
        if (filter == null) {
            return null;
        }
        const element = columns.get(key);
        if (!element || !getFilterByType[element.type]) {
            log.error(
                errorCreator(
                    'tried to convert a filter to api value, but there was no filter converter or specification found')({
                    filter,
                    element,
                }),
            );
            return null;
        }

        if (typeof filter.isEmpty === 'boolean') {
            return { ...toApiEmptyValueFilter(filter), dataItem: key };
        }

        if (filter.usingOptionSet) {
            return {
                ...getApiOptionSetFilter(filter, element.type),
                dataItem: key,
            };
        }

        return {
            ...getFilterByType[element.type](filter),
            dataItem: key,
        };
    })
    .filter(value => value != null);

const getMainFilter = (filter: any): any => {
    let mainValue;
    const { dataItem, ...filterValues } = filter;
    switch (dataItem) {
    case 'status':
        mainValue = {
            status: filterValues.in[0],
        };
        break;
    case 'occurredAt':
        mainValue = {
            eventDate: filterValues.dateFilter,
        };
        break;
    case 'assignee':
        mainValue = filterValues;
        break;
    default:
        mainValue = null;
        break;
    }
    return mainValue;
};

const structureFilters = (apiFilters: Array<any>, columns: ColumnsForConverter) => apiFilters
    .reduce((acc, filter) => {
        const element = columns.get(filter.dataItem);

        if (element && 'isMainProperty' in element && element.isMainProperty) {
            const mainFilter = getMainFilter(filter);
            const filters = {
                ...acc,
                ...mainFilter,
            };
            return filters;
        }

        acc.dataFilters.push(filter);
        return acc;
    }, {
        dataFilters: [],
    });

const getApiSortById = (sortById: string, columns: ColumnsForConverter) => {
    const column = columns.get(sortById);
    if (column && 'isMainProperty' in column && column.isMainProperty) {
        return column.apiName ?? sortById;
    }
    return sortById;
};

const getSortOrder = (sortById: string, sortByDirection: string) => `${sortById}:${sortByDirection}`;

const getColumnsOrder = (columns: Array<ColumnForConverter>) =>
    columns
        .filter(column => column.visible)
        .map(column => ('apiName' in column ? column.apiName : column.id));

export const convertToEventFilterEventQueryCriteria = ({
    filters,
    sortById,
    sortByDirection,
    columns,
}: {
    filters: any,
    sortById: string,
    sortByDirection: string,
    columns: ColumnsForConverter,
}): ApiEventQueryCriteria => {
    const apiSortById = getApiSortById(sortById, columns);
    const sortOrderCriteria = getSortOrder(apiSortById, sortByDirection);
    const filtersCriteria = pipe(
        () => typeConvertFilters(filters, columns),
        convertedFilters => structureFilters(convertedFilters, columns),
    )();
    const displayColumnOrderCriteria = getColumnsOrder([...columns.values()]);

    return {
        ...filtersCriteria,
        order: sortOrderCriteria,
        displayColumnOrder: displayColumnOrderCriteria,
    };
};
