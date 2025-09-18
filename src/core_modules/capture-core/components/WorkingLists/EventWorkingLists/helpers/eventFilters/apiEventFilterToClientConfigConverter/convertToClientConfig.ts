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
import { areRelativeRangeValuesSupported }
    from '../../../../../../utils/validation/validators/areRelativeRangeValuesSupported';
import { dataElementTypes } from '../../../../../../metaData';

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

const getDateFilter = ({ dateFilter }: ApiDataFilterDate): DateFilterData | null | undefined => {
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

const getAssigneeFilter = async (
    assignedUserMode: typeof apiAssigneeFilterModes[keyof typeof apiAssigneeFilterModes],
    assignedUsers: Array<string> | null | undefined,
    querySingleResource: QuerySingleResource,
): Promise<AssigneeFilterData | null | undefined> => {
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

const isOptionSetFilter = (type: keyof typeof dataElementTypes, filter: any) => {
    if (filterTypesObject.BOOLEAN === type) {
        const validBooleanValues = ['true', 'false'];
        return filter.in.some(value => !validBooleanValues.includes[value]);
    }

    return filter.in;
};

const getSortOrder = (
    order?: string | null,
    columnsMetaForDataFetching?: ColumnsMetaForDataFetching,
) => {
    const [sortById, sortByDirection] = order?.split(':') ?? [];

    if (!sortById || !sortByDirection) {
        return { sortById: 'occurredAt', sortByDirection: 'desc' };
    }

    const sortByColumn = columnsMetaForDataFetching && (
        [...columnsMetaForDataFetching.entries()]
            .find(([, { apiName }]) => apiName === sortById)?.[1]
        ?? columnsMetaForDataFetching.get(sortById)
    );

    if (!sortByColumn?.id) {
        return { sortById: 'occurredAt', sortByDirection: 'desc' };
    }

    return { sortById: sortByColumn.id, sortByDirection };
};

const getDataElementFilters = (
    filters: Array<ApiDataFilter> | null | undefined,
    columnsMetaForDataFetching: ColumnsMetaForDataFetching): any[] => {
    if (!filters) {
        return [];
    }

    return filters.map((serverFilter) => {
        const element = columnsMetaForDataFetching.get(serverFilter.dataItem);
        if (!element || !getFilterByType[element.type]) {
            return null;
        }

        if (isOptionSetFilter(element.type, serverFilter)) {
            return {
                ...getOptionSetFilter(serverFilter as any, element.type),
                id: serverFilter.dataItem,
            };
        }
        const dataValue = (getFilterByType[element.type](serverFilter, element));

        return dataValue && {
            id: serverFilter.dataItem,
            ...dataValue,
        };
    }).filter(clientFilter => clientFilter);
};

const getMainDataFilters = async (
    eventQueryCriteria: ApiEventQueryCriteria | null,
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
    querySingleResource: QuerySingleResource,
) => {
    if (!eventQueryCriteria) {
        return [];
    }

    const { occurredAt, status, assignedUserMode, assignedUsers } = eventQueryCriteria;
    const filters: any[] = [];
    if (status) {
        filters.push({ 
            ...getOptionSetFilter({ in: [status] }, columnsMetaForDataFetching.get('status')!.type), 
            id: 'status' 
        });
    }
    if (occurredAt) {
        const convertedDate = getDateFilter({ dateFilter: occurredAt });
        convertedDate && 
            filters.push({ ...convertedDate, id: 'occurredAt', locked: occurredAt.lockedAll });
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
    eventQueryCriteria: ApiEventQueryCriteria | null,
    columnsMetaForDataFetching: ColumnsMetaForDataFetching,
    querySingleResource: QuerySingleResource,
): Promise<ClientConfig> {
    const { sortById, sortByDirection } = getSortOrder(eventQueryCriteria?.order, columnsMetaForDataFetching);
    const filters = [
        ...getDataElementFilters(eventQueryCriteria?.dataFilters, columnsMetaForDataFetching),
        ...(await getMainDataFilters(eventQueryCriteria, columnsMetaForDataFetching, querySingleResource)),
    ].reduce((acc, filter) => {
        const { id, ...filterData } = filter;
        acc[id] = filterData;
        return acc;
    }, {});

    const customColumnOrder = getCustomColumnsConfiguration(
        eventQueryCriteria && eventQueryCriteria.displayColumnOrder, 
        columnsMetaForDataFetching
    ) || undefined;

    return {
        filters,
        customColumnOrder,
        sortById,
        sortByDirection,
        ...listConfigDefaults,
    };
}
