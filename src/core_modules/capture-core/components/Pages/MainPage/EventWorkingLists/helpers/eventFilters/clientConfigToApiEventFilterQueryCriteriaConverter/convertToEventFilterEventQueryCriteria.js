// @flow
import log from 'loglevel';
import { errorCreator, pipe } from 'capture-core-utils';
import { moment } from 'capture-core-utils/moment';
import {
    dataElementTypes as elementTypes,
} from '../../../../../../../metaData';
import { getApiOptionSetFilter } from './optionSet';

import {
    dateFilterTypes,
    type AssigneeFilterData,
    type DateFilterData,
    type BooleanFilterData,
    type TextFilterData,
    type NumericFilterData,
} from '../../../../WorkingLists';
import type {
    ApiDataFilterNumeric,
    ApiDataFilterText,
    ApiDataFilterBoolean,
    ApiDataFilterTrueOnly,
    ApiDataFilterDate,
    ApiDataFilterAssignee,
    ApiEventQueryCriteria,
} from '../../../types';

type ColumnForConverterBase = {|
    id: string,
    type: $Values<typeof elementTypes>,
    visible: boolean,
|};
type MetadataColumnForConverter = {|
    ...ColumnForConverterBase,
|};

type MainColumnForConverter = {|
    ...ColumnForConverterBase,
    isMainProperty: true,
    apiName?: string,
|};

type ColumnForConverter = MetadataColumnForConverter | MainColumnForConverter;


type ColumnsForConverter = Map<string, ColumnForConverter>;

const getTextFilter = (filter: TextFilterData): ApiDataFilterText => ({
    like: filter.value,
});

const getNumericFilter = (filter: NumericFilterData): ApiDataFilterNumeric => ({
    ge: filter.ge ? filter.ge.toString() : undefined,
    le: filter.le ? filter.le.toString() : undefined,
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

const getDateFilter = (filter: DateFilterData): ApiDataFilterDate => {
    if (filter.type === dateFilterTypes.RELATIVE) {
        return {
            type: filter.type,
            period: filter.period,
        };
    }

    return {
        type: filter.type,
        startDate: filter.ge ? convertDate(filter.ge) : undefined,
        endDate: filter.le ? convertDate(filter.le) : undefined,
    };
};

const getAssigneeFilter = (filter: AssigneeFilterData): ApiDataFilterAssignee => ({
    assignedUserMode: filter.assignedUserMode,
    assignedUsers: filter.assignedUser ? [filter.assignedUser.id] : undefined,
});

const getFilterByType = {
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TEXT]: getTextFilter,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.NUMBER]: getNumericFilter,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER]: getNumericFilter,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_POSITIVE]: getNumericFilter,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_NEGATIVE]: getNumericFilter,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: getNumericFilter,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.DATE]: getDateFilter,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.BOOLEAN]: getBooleanFilter,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.TRUE_ONLY]: getTrueOnlyFilter,
    // $FlowFixMe[prop-missing] automated comment
    [elementTypes.ASSIGNEE]: getAssigneeFilter,
};

const typeConvertFilters = (filters: Object, columns: ColumnsForConverter) => Object
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

const getMainFilter = (filter: Object): Object => {
    let mainValue;
    const { dataItem, ...filterValues } = filter;
    switch (dataItem) {
    case 'status':
        mainValue = {
            status: filterValues.in[0],
        };
        break;
    case 'eventDate':
        mainValue = {
            eventDate: filterValues,
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

const structureFilters = (apiFilters: Array<Object>, columns: ColumnsForConverter) => apiFilters
    .reduce((acc, filter) => {
        const element = columns.get(filter.dataItem);

        // $FlowFixMe[incompatible-type] automated comment
        if (element.isMainProperty) {
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

const getSortOrder = (sortById: string, sortByDirection: string) => `${sortById}:${sortByDirection}`;

const getColumnsOrder = (columns: Array<ColumnForConverter>) =>
    columns
        .filter(column => column.visible)
        .map(column => column.apiName || column.id);

export const convertToEventFilterEventQueryCriteria = ({
    filters,
    sortById,
    sortByDirection,
    columns,
}: {|
    filters: Object,
    sortById: string,
    sortByDirection: string,
    columns: ColumnsForConverter,
|}): ApiEventQueryCriteria => {
    const sortOrderCriteria = getSortOrder(sortById, sortByDirection);
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
