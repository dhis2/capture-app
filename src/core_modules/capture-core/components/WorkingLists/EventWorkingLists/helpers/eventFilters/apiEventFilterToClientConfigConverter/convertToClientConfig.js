// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import moment from 'moment';
import { getCustomColumnsConfiguration } from '../getCustomColumnsConfiguration';
import { getOptionSetFilter } from './optionSet';
import { apiAssigneeFilterModes, apiDateFilterTypes } from '../../../constants';
import type { QuerySingleResource } from '../../../../../../utils/api/api.types';

import {
    filterTypesObject,
    type AssigneeFilterData,
    type DateFilterData,
    type BooleanFilterData,
    type TrueOnlyFilterData,
    type TextFilterData,
    type NumericFilterData,
} from '../../../../WorkingListsBase';
import type {
    ApiDataFilter,
    ApiDataFilterNumeric,
    ApiDataFilterText,
    ApiDataFilterBoolean,
    ApiDataFilterDate,
    ApiEventQueryCriteria,
    ColumnsMetaForDataFetching,
    ClientConfig,
} from '../../../types';
import { areRelativeRangeValuesSupported } from '../../../../../../utils/validators/areRelativeRangeValuesSupported';

const getTextFilter = (filter: ApiDataFilterText): TextFilterData => {
    const value = filter.like;
    return {
        value,
    };
};

const getNumericFilter = (filter: ApiDataFilterNumeric): NumericFilterData => ({
    ge: filter.ge ? Number(filter.ge) : undefined,
    le: filter.le ? Number(filter.le) : undefined,
});

const getBooleanFilter = (filter: ApiDataFilterBoolean): BooleanFilterData => ({
    values: filter.in.map(value => value === 'true'),
});

const getTrueOnlyFilter = (/* filter: ApiDataFilterTrueOnly */): TrueOnlyFilterData => ({
    value: true,
});

const getDateFilter = ({ dateFilter }: ApiDataFilterDate): ?DateFilterData => {
    if (dateFilter.type === apiDateFilterTypes.RELATIVE) {
        if (dateFilter.period) {
            return {
                type: dateFilter.type,
                period: dateFilter.period,
            };
        }
        if (areRelativeRangeValuesSupported(dateFilter.startBuffer, dateFilter.endBuffer)) {
            return {
                type: dateFilter.type,
                startBuffer: dateFilter.startBuffer,
                endBuffer: dateFilter.endBuffer,
            };
        }
        return undefined;
    }
    if (dateFilter.type === apiDateFilterTypes.ABSOLUTE) {
        return {
            type: dateFilter.type,
            ge: dateFilter.startDate ? moment(dateFilter.startDate, 'YYYY-MM-DD').toISOString() : undefined,
            le: dateFilter.endDate ? moment(dateFilter.endDate, 'YYYY-MM-DD').toISOString() : undefined,
        };
    }
    return undefined;
};

const getUser = (userId: string, querySingleResource: QuerySingleResource) =>
    querySingleResource({
        resource: `userLookup/${userId}`,
    })
        .then(({ id, displayName: name, username }) => ({
            id,
            name,
            username,
        }))
        .catch((error) => {
            log.error(errorCreator('An error occured retrieving assignee user')({ error, userId }));
            return null;
        });

// eslint-disable-next-line complexity
const getAssigneeFilter = async (
    assignedUserMode: $Values<typeof apiAssigneeFilterModes>,
    assignedUsers: ?Array<string>,
    querySingleResource: QuerySingleResource,
): Promise<?AssigneeFilterData> => {
    if (assignedUserMode === apiAssigneeFilterModes.PROVIDED) {
        const assignedUserId = assignedUsers && assignedUsers.length > 0 && assignedUsers[0];
        if (!assignedUserId) {
            return undefined;
        }

        const user = await getUser(assignedUserId, querySingleResource);
        if (!user) {
            return undefined;
        }

        return {
            assignedUserMode,
            assignedUser: user,
        };
    }

    return {
        assignedUserMode,
    };
};

const getFilterByType = {
    [filterTypesObject.TEXT]: getTextFilter,
    [filterTypesObject.NUMBER]: getNumericFilter,
    [filterTypesObject.INTEGER]: getNumericFilter,
    [filterTypesObject.INTEGER_POSITIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_NEGATIVE]: getNumericFilter,
    [filterTypesObject.INTEGER_ZERO_OR_POSITIVE]: getNumericFilter,
    [filterTypesObject.DATE]: getDateFilter,
    [filterTypesObject.BOOLEAN]: getBooleanFilter,
    [filterTypesObject.TRUE_ONLY]: getTrueOnlyFilter,
};

const isOptionSetFilter = (type: $Keys<typeof filterTypesObject>, filter: any) => {
    if ([
        filterTypesObject.BOOLEAN,
    ].includes(type)) {
        const validBooleanValues = ['true', 'false'];
        return filter.in.some(value => !validBooleanValues.includes[value]);
    }

    return filter.in;
};

const getSortOrder = (order: ?string) => {
    const sortOrderParts = order && order.split(':');
    if (!sortOrderParts || sortOrderParts.length < 2) {
        return {
            sortById: 'occurredAt',
            sortByDirection: 'desc',
        };
    }

    return {
        sortById: sortOrderParts[0],
        sortByDirection: sortOrderParts[1],
    };
};

const getDataElementFilters = (
    filters: ?Array<ApiDataFilter>,
    columnsMetaForDataFetching: ColumnsMetaForDataFetching): Array<Object> => {
    if (!filters) {
        return [];
    }

    return filters.map((serverFilter) => {
        const element = columnsMetaForDataFetching.get(serverFilter.dataItem);
        // $FlowFixMe I accept that not every type is listed, thats why I'm doing this test
        if (!element || !getFilterByType[element.type]) {
            return null;
        }

        // $FlowFixMe If previous test doesn't return, element.type is a key in filterTypesObject
        if (isOptionSetFilter(element.type, serverFilter)) {
            return {
                // $FlowFixMe
                ...getOptionSetFilter(serverFilter, element.type),
                id: serverFilter.dataItem,
            };
        }
        // $FlowFixMe I accept that not every type is listed, thats why I'm doing this test
        const dataValue = (getFilterByType[element.type](serverFilter, element));

        return dataValue && {
            id: serverFilter.dataItem,
            ...dataValue,
        };
    }).filter(clientFilter => clientFilter);
};

// eslint-disable-next-line complexity
const getMainDataFilters = async (
    eventQueryCriteria: ?ApiEventQueryCriteria,
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
    querySingleResource: QuerySingleResource,
) => {
    if (!eventQueryCriteria) {
        return [];
    }

    const { occurredAt, status, assignedUserMode, assignedUsers } = eventQueryCriteria;
    const filters = [];
    if (status) {
        // $FlowFixMe
        filters.push({ ...getOptionSetFilter({ in: [status] }, columnsMetaForDataFetching.get('status').type), id: 'status' });
    }
    if (occurredAt) {
        const convertedDate = getDateFilter({ dateFilter: occurredAt });
        convertedDate && filters.push({ ...convertedDate, id: 'occurredAt' });
    }
    if (assignedUserMode) {
        filters.push({
            ...(await getAssigneeFilter(assignedUserMode, assignedUsers, querySingleResource)),
            id: 'assignee',
        });
    }
    return filters;
};

const listConfigDefaults = {
    currentPage: 1,
    rowsPerPage: 15,
};

export async function convertToClientConfig(
    eventQueryCriteria: ?ApiEventQueryCriteria,
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
    querySingleResource: QuerySingleResource,
): Promise<ClientConfig> {
    const { sortById, sortByDirection } = getSortOrder(eventQueryCriteria && eventQueryCriteria.order);
    const filters = [
        ...getDataElementFilters(eventQueryCriteria && eventQueryCriteria.dataFilters, columnsMetaForDataFetching),
        ...(await getMainDataFilters(eventQueryCriteria, columnsMetaForDataFetching, querySingleResource)),
    ].reduce((acc, filter) => {
        const { id, ...filterData } = filter;
        acc[id] = filterData;
        return acc;
    }, {});

    const customColumnOrder =
        getCustomColumnsConfiguration(eventQueryCriteria && eventQueryCriteria.displayColumnOrder, columnsMetaForDataFetching);


    return {
        filters,
        customColumnOrder,
        sortById,
        sortByDirection,
        ...listConfigDefaults,
    };
}
