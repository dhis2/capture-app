// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { moment } from 'capture-core-utils/moment';
import {
    dataElementTypes as elementTypes,
} from '../../../../../../../metaData';
import { getColumnsConfiguration } from '../columnsConfigurationGetter';
import { getApi } from '../../../../../../../d2/d2Instance';
import { getOptionSetFilter } from './optionSet';

import {
    assigneeFilterModes,
    dateFilterTypes,
    type AssigneeFilterData,
    type DateFilterData,
    type BooleanFilterData,
    type TrueOnlyFilterData,
    type TextFilterData,
    type NumericFilterData,
} from '../../../../EventsList/eventList.types';
import type {
    ApiDataFilter,
    ApiDataFilterNumeric,
    ApiDataFilterText,
    ApiDataFilterBoolean,
    ApiDataFilterDate,
    ApiEventQueryCriteria,
} from '../../../workingLists.types';

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

const getDateFilter = (filter: ApiDataFilterDate): DateFilterData => {
    if (filter.period) {
        return {
            type: dateFilterTypes.RELATIVE,
            period: filter.period,
        };
    }

    return {
        type: dateFilterTypes.ABSOLUTE,
        startDate: filter.startDate ? moment(filter.startDate, 'YYYY-MM-DD').toISOString() : undefined,
        endDate: filter.endDate ? moment(filter.endDate, 'YYYY-MM-DD').toISOString() : undefined,
    };
};

const getUser = (userId: string) => getApi()
    .get(`users/${userId}`, { fields: 'id,name,userCredentials[username]' })
    .then((user: Object) => ({
        id: user.id,
        name: user.name,
        username: user.userCredentials.username,
    }))
    .catch((error) => {
        log.error(
            errorCreator('An error occured retrieving assignee user')({ error, userId }),
        );
        return null;
    });

// eslint-disable-next-line complexity
const getAssigneeFilter = async (
    assignedUserMode: $Values<typeof assigneeFilterModes>,
    assignedUsers: ?Array<string>,
): Promise<?AssigneeFilterData> => {
    if (assignedUserMode === assigneeFilterModes.PROVIDED) {
        const assignedUserId = assignedUsers && assignedUsers.length > 0 && assignedUsers[0];
        if (!assignedUserId) {
            return undefined;
        }

        const user = await getUser(assignedUserId);
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
};

const isOptionSetFilter = (type: $Values<typeof elementTypes>, filter: any) => {
    if ([
        // $FlowFixMe[prop-missing] automated comment
        elementTypes.BOOLEAN,
    ].includes(type)) {
        const validBooleanValues = ['true', 'false'];
        return filter.in.some(value => !validBooleanValues.includes[value]);
    }

    return filter.in;
};

const getSortOrder = (order: ?string) => {
    const sortOrderParts = order && order.split(':');
    if (!sortOrderParts || sortOrderParts.length !== 2) {
        return {
            sortById: 'eventDate',
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
    defaultSpecs: Map<string, Object>): Array<Object> => {
    if (!filters) {
        return [];
    }

    return filters.map((serverFilter) => {
        const element = defaultSpecs.get(serverFilter.dataItem);
        if (!element || !getFilterByType[element.type]) {
            return null;
        }

        if (isOptionSetFilter(element.type, serverFilter)) {
            return {
                // $FlowFixMe
                ...getOptionSetFilter(serverFilter, element.type),
                id: serverFilter.dataItem,
            };
        }

        return {
            id: serverFilter.dataItem,
            ...(getFilterByType[element.type] ? getFilterByType[element.type](serverFilter, element) : null),
        };
    }).filter(clientFilter => clientFilter);
};

// eslint-disable-next-line complexity
const getMainDataFilters = async (
    eventQueryCriteria: ?ApiEventQueryCriteria,
    defaultSpecs: Map<string, Object>,
) => {
    if (!eventQueryCriteria) {
        return [];
    }

    const { eventDate, status, assignedUserMode, assignedUsers } = eventQueryCriteria;
    const filters = [];
    if (status) {
        // $FlowFixMe
        filters.push({ ...getOptionSetFilter({ in: [status] }, defaultSpecs.get('status').type), id: 'status' });
    }
    if (eventDate) {
        filters.push({ ...getDateFilter(eventDate), id: 'eventDate' });
    }
    if (assignedUserMode) {
        filters.push({ ...(await getAssigneeFilter(assignedUserMode, assignedUsers)), id: 'assignee' });
    }
    return filters;
};

const listConfigDefaults = {
    currentPage: 1,
    rowsPerPage: 15,
};

export async function convertToListConfig(
    eventQueryCriteria: ?ApiEventQueryCriteria,
    defaultSpecs: Map<string, Object>,
) {
    const { sortById, sortByDirection } = getSortOrder(eventQueryCriteria && eventQueryCriteria.order);
    const filters = [
        ...getDataElementFilters(eventQueryCriteria && eventQueryCriteria.dataFilters, defaultSpecs),
        ...(await getMainDataFilters(eventQueryCriteria, defaultSpecs)),
    ].reduce((acc, filter) => {
        const { id, ...filterData } = filter;
        acc[id] = filterData;
        return acc;
    }, {});

    const columnOrder =
        getColumnsConfiguration(eventQueryCriteria && eventQueryCriteria.displayColumnOrder, defaultSpecs);


    return {
        filters,
        columnOrder,
        sortById,
        sortByDirection,
        ...listConfigDefaults,
    };
}
