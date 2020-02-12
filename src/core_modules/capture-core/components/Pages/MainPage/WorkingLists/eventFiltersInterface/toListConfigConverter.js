// @flow
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { pipe, errorCreator } from 'capture-core-utils';
import { canViewOtherUsers } from '../../../../../d2';
import {
    getBooleanFilterData,
    getMultiSelectOptionSetFilterData,
    getSingleSelectOptionSetFilterData,
    getNumericFilterData,
    getTextFilterData,
    getTrueOnlyFilterData,
    getDateFilterData,
    getAssigneeFilterData,
    assigneeFilterModeKeys,
} from '../../../../FiltersForTypes';
import {
    dataElementTypes as elementTypes,
    DataElement,
    RenderFoundation,
    OptionSet,
    Option,
    ProgramStage,
} from '../../../../../metaData';
import eventStatusElement from '../../../../../events/eventStatusElement';
import { convertServerToClient, convertClientToForm } from '../../../../../converters';
import { getColumnsConfiguration } from './columnsConfigurationGetter';
import { getApi } from '../../../../../d2/d2Instance';
import type { ApiDataFilter, ApiEventQueryCriteria } from '../workingLists.types';

const booleanOptionSet = new OptionSet('booleanOptionSet', [
    new Option((_this) => { _this.text = i18n.t('Yes'); _this.value = 'true'; }),
    new Option((_this) => { _this.text = i18n.t('No'); _this.value = 'false'; }),
]);

const getNumericFilter = (filter: Object) => {
    const value = { min: filter.ge, max: filter.le };
    return {
        ...getNumericFilterData(value),
        value,
    };
};

const getBooleanFilter = (filter: Object, element: DataElement) => {
    const value = [...(filter.in || [])];
    return {
        ...getBooleanFilterData(value, element.type, element.optionSet || booleanOptionSet),
        value,
    };
};

const getMultiSelectOptionSetFilter = (filter: Object, element: DataElement) => {
    const value = [...(filter.in || [])];
    return {
        // $FlowFixMe
        ...getMultiSelectOptionSetFilterData(value, element.type, element.optionSet),
        value,
    };
};

const getSingleSelectOptionSetFilter = (filter: Object, element: DataElement) => {
    const value = filter.eq;
    return {
        // $FlowFixMe
        ...getSingleSelectOptionSetFilterData(value, element.optionSet),
        value,
    };
};

const getTrueOnlyFilter = (filter: Object, element: DataElement) => {
    const value = [...(filter.in || [])];
    return {
        ...getTrueOnlyFilterData(value, element.type),
        value,
    };
};

const getTextFilter = (filter: Object) => {
    const value = filter.like;
    return {
        ...getTextFilterData(value),
        value,
    };
};

const getDateFilter = (filter: Object) => {
    const value = {
        main: filter.period || 'CUSTOM_RANGE',
        from: filter.startDate && pipe(convertServerToClient, convertClientToForm)(filter.startDate, elementTypes.DATE),
        to: filter.endDate && pipe(convertServerToClient, convertClientToForm)(filter.endDate, elementTypes.DATE),
    };

    return {
        ...getDateFilterData(value),
        value,
    };
};

const getUser = (userId: string) => {
    return getApi()
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
};

// eslint-disable-next-line complexity
const getAssigneeFilter = async (
    assignedUserMode: $Values<typeof assigneeFilterModeKeys>,
    assignedUsers: ?Array<string>,
) => {
    const value = {
        mode: assignedUserMode,
        provided: undefined,
    };

    if (assignedUserMode === assigneeFilterModeKeys.PROVIDED) {
        const assignedUserId = assignedUsers && assignedUsers.length > 0 && assignedUsers[0];
        if (!assignedUserId) {
            return undefined;
        }

        const user = await getUser(assignedUserId);
        if (!user) {
            return undefined;
        }
        value.provided = user;
    }

    return {
        ...getAssigneeFilterData(value),
        value,
    };
};

const getFilterByType = {
    [elementTypes.TEXT]: getTextFilter,
    [elementTypes.NUMBER]: getNumericFilter,
    [elementTypes.INTEGER]: getNumericFilter,
    [elementTypes.INTEGER_POSITIVE]: getNumericFilter,
    [elementTypes.INTEGER_NEGATIVE]: getNumericFilter,
    [elementTypes.INTEGER_ZERO_OR_POSITIVE]: getNumericFilter,
    [elementTypes.DATE]: getDateFilter,
    [elementTypes.BOOLEAN]: getBooleanFilter,
    [elementTypes.TRUE_ONLY]: getTrueOnlyFilter,
};

const getSortOrder = (order: ?string) => {
    const sortOrderParts = order && order.split(':');
    if (sortOrderParts && sortOrderParts.length === 2) {
        return {
            sortById: sortOrderParts[0],
            sortByDirection: sortOrderParts[1],
        };
    }
    return null;
};

const getDataElementFilters = (filters: ?Array<ApiDataFilter>, stageForm: RenderFoundation): Array<Object> => {
    if (!filters) {
        return [];
    }

    return filters.map((serverFilter) => {
        const element = stageForm.getElement(serverFilter.dataItem);
        if (element) {
            if (element.optionSet && element.optionSet.options.length <= 5) { //TODO: FIX
                return { id: serverFilter.dataItem, ...getMultiSelectOptionSetFilter(serverFilter, element) };
            }
            return {
                id: serverFilter.dataItem,
                // $FlowFixMe
                ...(getFilterByType[element.type] ? getFilterByType[element.type](serverFilter, element) : null),
            };
        }
        // $FlowFixMe
        return null;
    }).filter(clientFilter => clientFilter);
};

const getMainDataFilters = async (eventQueryCriteria: ApiEventQueryCriteria) => {
    const { eventDate, status, assignedUserMode, assignedUsers } = eventQueryCriteria;
    const filters = [];
    if (status) {
        filters.push({ id: 'status', ...getSingleSelectOptionSetFilter({ eq: status }, eventStatusElement) });
    }
    if (eventDate) {
        filters.push({ id: 'eventDate', ...getDateFilter(eventDate) });
    }
    if (assignedUserMode && canViewOtherUsers()) {
        filters.push({ id: 'assignee', ...(await getAssigneeFilter(assignedUserMode, assignedUsers)) });
    }
    return filters;
};

export async function convertToListConfig(
    eventQueryCriteria: ?ApiEventQueryCriteria,
    stage: ProgramStage,
) {
    if (!eventQueryCriteria) {
        return undefined;
    }

    const { sortById, sortByDirection } = getSortOrder(eventQueryCriteria.order) || {};
    const filters = [
        ...getDataElementFilters(eventQueryCriteria.dataFilters, stage.stageForm),
        ...(await getMainDataFilters(eventQueryCriteria)),
    ];

    const columnOrder = getColumnsConfiguration(stage, eventQueryCriteria.displayColumnOrder);

    return {
        filters,
        columnOrder,
        sortById,
        sortByDirection,
    };
}
