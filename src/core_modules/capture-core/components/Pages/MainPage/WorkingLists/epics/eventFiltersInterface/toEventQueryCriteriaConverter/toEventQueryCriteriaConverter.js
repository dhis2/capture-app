// @flow
import log from 'loglevel';
import { errorCreator, pipe } from 'capture-core-utils';
import { moment } from 'capture-core-utils/moment';
import { dataElementTypes } from '../../../../../../../metaData';
import { getApiOptionSetFilter } from './optionSet';

import {
    dateFilterTypes,
    type AssigneeFilterData,
    type DateFilterData,
    type BooleanFilterData,
    type TextFilterData,
    type NumericFilterData,
} from '../../../../EventsList/eventList.types';
import type {
    ColumnConfig,
    ApiDataFilterNumeric,
    ApiDataFilterText,
    ApiDataFilterBoolean,
    ApiDataFilterTrueOnly,
    ApiDataFilterDate,
    ApiDataFilterAssignee,
    ApiEventQueryCriteria,
} from '../../../workingLists.types';


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
    [dataElementTypes.TEXT]: getTextFilter,
    [dataElementTypes.NUMBER]: getNumericFilter,
    [dataElementTypes.INTEGER]: getNumericFilter,
    [dataElementTypes.INTEGER_POSITIVE]: getNumericFilter,
    [dataElementTypes.INTEGER_NEGATIVE]: getNumericFilter,
    [dataElementTypes.INTEGER_ZERO_OR_POSITIVE]: getNumericFilter,
    [dataElementTypes.DATE]: getDateFilter,
    [dataElementTypes.BOOLEAN]: getBooleanFilter,
    [dataElementTypes.TRUE_ONLY]: getTrueOnlyFilter,
    [dataElementTypes.ASSIGNEE]: getAssigneeFilter,
};

const getFilters = (filters: Object, defaultSpecs: Map<string, Object>) => Object
    .keys(filters)
    .map((key) => {
        const filter = filters[key];
        if (filter == null) {
            return null;
        }
        const element = defaultSpecs.get(key);

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
            ...getFilterByType[element.type](filter, element),
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

const buildMainAndDataFilters = (apiFilters: Array<Object>, defaultSpecs: Map<string, Object>) => apiFilters
    .reduce((acc, filter) => {
        const element = defaultSpecs.get(filter.dataItem);

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

const getOrder = (sortById: string, sortByDirection: string) => `${sortById}:${sortByDirection}`;

const getColumnsOrder = (columns: Array<ColumnConfig>) =>
    columns
        .filter(column => column.visible)
        .map(column => column.apiName || column.id);

export function convertToEventQueryCriteria({
    // $FlowFixMe[prop-missing] automated comment
    filters: listFilters,
    // $FlowFixMe[prop-missing] automated comment
    sortById: listSortById,
    // $FlowFixMe[prop-missing] automated comment
    sortByDirection: listSortByDirection,
    // $FlowFixMe[prop-missing] automated comment
    columnOrder: listColumns,
    defaultConfig,
}: {
    listFilters: Object,
    listSortById: string,
    listSortByDirection: string,
    listColumns: Array<Object>,
    defaultConfig: Map<string, Object>,
}): ApiEventQueryCriteria {
    const order = getOrder(listSortById, listSortByDirection);
    const filters = pipe(
        () => getFilters(listFilters, defaultConfig),
        convertedFilters => buildMainAndDataFilters(convertedFilters, defaultConfig),
    )();
    const displayColumnOrder = getColumnsOrder(listColumns);

    return {
        ...filters,
        order,
        displayColumnOrder,
    };
}
