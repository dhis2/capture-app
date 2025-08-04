import moment from 'moment';
import { apiAssigneeFilterModes, apiDateFilterTypes } from '../../../constants';
import type { ClientConfig, ColumnsMetaForDataFetching, ApiEventQueryCriteria } from '../../../types';
import {
    filterTypesObject,
    type AssigneeFilterData,
    type DateFilterData,
    type BooleanFilterData,
    type TextFilterData,
    type NumericFilterData,
} from '../../../../WorkingListsBase';

const getTextFilter = (filter: TextFilterData) => ({
    like: filter.value,
});

const getNumericFilter = (filter: NumericFilterData) => {
    const numericFilter: any = {};
    if (filter.ge || filter.ge === 0) {
        numericFilter.ge = filter.ge.toString();
    }
    if (filter.le || filter.le === 0) {
        numericFilter.le = filter.le.toString();
    }
    return numericFilter;
};

const getBooleanFilter = (filter: BooleanFilterData) => ({
    in: filter.values.map(value => value.toString()),
});

const getTrueOnlyFilter = () => ({
    eq: 'true',
});

const getDateFilter = (filter: DateFilterData) => {
    if (filter.type === apiDateFilterTypes.RELATIVE) {
        if (filter.period) {
            return {
                type: filter.type,
                period: filter.period,
            };
        }
        return {
            type: filter.type,
            startBuffer: filter.startBuffer,
            endBuffer: filter.endBuffer,
        };
    }
    if (filter.type === apiDateFilterTypes.ABSOLUTE) {
        const dateFilter: any = { type: filter.type };
        if (filter.ge) {
            dateFilter.startDate = moment(filter.ge).format('YYYY-MM-DD');
        }
        if (filter.le) {
            dateFilter.endDate = moment(filter.le).format('YYYY-MM-DD');
        }
        return dateFilter;
    }
    return {};
};

const getAssigneeFilter = (filter: AssigneeFilterData) => {
    if (filter.assignedUserMode === apiAssigneeFilterModes.PROVIDED) {
        return {
            assignedUserMode: filter.assignedUserMode,
            assignedUsers: filter.assignedUser ? [filter.assignedUser.id] : [],
        };
    }

    return {
        assignedUserMode: filter.assignedUserMode,
    };
};

const getFilterByType: any = {
    [filterTypesObject.TEXT]: getTextFilter,
    [filterTypesObject.NUMBER]: getNumericFilter,
    [filterTypesObject.INTEGER]: getNumericFilter,
    [filterTypesObject.INTEGER_POSITIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_NEGATIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: getNumericFilter,
    [filterTypesObject.DATE]: getDateFilter,
    [filterTypesObject.BOOLEAN]: getBooleanFilter,
    [filterTypesObject.TRUE_ONLY]: getTrueOnlyFilter,
    [filterTypesObject.ASSIGNEE]: getAssigneeFilter,
};

const getDataElementFilters = (
    filters: { [id: string]: any },
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
) =>
    Object
        .keys(filters)
        .map((key) => {
            const element = columnsMetaForDataFetching.get(key);
            if (!element) {
                return null;
            }

            if (!getFilterByType[element.type]) {
                return null;
            }

            const filterData = getFilterByType[element.type](filters[key]);

            return {
                dataItem: key,
                ...filterData,
            };
        })
        .filter(filter => filter);

const getSortOrder = (
    sortById: string,
    sortByDirection: string,
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
) => {
    const element = columnsMetaForDataFetching.get(sortById);
    if (!element) {
        return `${sortById}:${sortByDirection}`;
    }

    return `${element.apiName || element.id}:${sortByDirection}`;
};

export const convertToEventFilterEventQueryCriteria = (
    clientConfig: ClientConfig,
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
): ApiEventQueryCriteria => {
    const { filters, sortById, sortByDirection, customColumnOrder } = clientConfig;

    const dataFilters = getDataElementFilters(filters, columnsMetaForDataFetching);
    const order = getSortOrder(sortById, sortByDirection, columnsMetaForDataFetching);

    const eventQueryCriteria: any = {
        dataFilters,
        order,
    };

    if (customColumnOrder) {
        eventQueryCriteria.displayColumnOrder = customColumnOrder
            .filter(({ visible }: any) => visible)
            .map(({ id }: any) => {
                const element = columnsMetaForDataFetching.get(id);
                return element?.apiName || id;
            });
    }

    return eventQueryCriteria;
};
