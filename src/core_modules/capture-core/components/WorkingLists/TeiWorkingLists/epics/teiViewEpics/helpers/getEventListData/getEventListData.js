// @flow
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import { convertToClientEvents } from './convertToClientEvents';
import {
    getSubvalues,
    getApiFilterQueryArgs,
    getMainApiFilterQueryArgs,
    getApiFilterAttributesQueryArgs,
    splitFilters,
    getOrderQueryArgs,
} from '../getListDataCommon';
import type { RawQueryArgs } from './types';
import type { InputMeta } from './getEventListData.types';
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching } from '../../../../types';
import { addTEIsData } from './addTEIsData';
import { getColumnsQueryArgs } from './getColumnsQueryArgs';
import { getScheduledDateQueryArgs } from './getScheduledDateQueryArgs';

const createApiEventQueryArgs = (
    {
        page,
        pageSize,
        programId: program,
        programStageId: programStage,
        orgUnitId: orgUnit,
        filters,
        sortById,
        sortByDirection,
    }: RawQueryArgs,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
): { [string]: any } => {
    const rawSplitFilters = splitFilters(filters, columnsMetaForDataFetching);
    const queryArgs = {
        ...getApiFilterQueryArgs(rawSplitFilters.filters, filtersOnlyMetaForDataFetching),
        ...getApiFilterAttributesQueryArgs(rawSplitFilters.filterAttributes, filtersOnlyMetaForDataFetching),
        ...getMainApiFilterQueryArgs(filters, filtersOnlyMetaForDataFetching),
        order: getOrderQueryArgs({ sortById, sortByDirection, withAPINameConverter: true }),
        page,
        pageSize,
        orgUnit,
        ouMode: orgUnit ? 'SELECTED' : 'ACCESSIBLE',
        program,
        programStage,
        fields: '*',
    };

    return getScheduledDateQueryArgs(queryArgs);
};

const createApiTEIsQueryArgs =
({ pageSize, programId: program }, trackedEntityIds): { [string]: any } => ({
    program,
    pageSize,
    trackedEntity: trackedEntityIds,
    fields:
    'trackedEntity,createdAt,orgUnit,attributes[attribute,value],enrollments[enrollment,status,orgUnit,enrolledAt]',
});

export const getEventListData = async (
    rawQueryArgs: RawQueryArgs,
    { columnsMetaForDataFetching, filtersOnlyMetaForDataFetching, querySingleResource, absoluteApiPath }: InputMeta,
) => {
    const { url: urlEvents, queryParams: queryParamsEvents } = {
        url: 'tracker/events',
        queryParams: createApiEventQueryArgs(rawQueryArgs, columnsMetaForDataFetching, filtersOnlyMetaForDataFetching),
    };
    const apiEventsResponse = await querySingleResource({
        resource: urlEvents,
        params: queryParamsEvents,
    });
    const apiEvents = handleAPIResponse(REQUESTED_ENTITIES.events, apiEventsResponse);

    if (apiEvents.length === 0) {
        return {
            recordContainers: [],
            request: {
                url: urlEvents,
                queryParams: queryParamsEvents,
            },
        };
    }

    const trackedEntityIds = apiEvents
        .reduce((acc, { trackedEntity }) => (acc.includes(trackedEntity) ? acc : [...acc, trackedEntity]), [])
        .filter(trackedEntityId => trackedEntityId)
        .join(';');

    const { url: urlTEIs, queryParams: queryParamsTEIs } = {
        url: 'tracker/trackedEntities',
        queryParams: createApiTEIsQueryArgs(rawQueryArgs, trackedEntityIds),
    };
    const apiTEIResponse = await querySingleResource({
        resource: urlTEIs,
        params: queryParamsTEIs,
    });
    const apiTrackedEntities = handleAPIResponse(REQUESTED_ENTITIES.trackedEntities, apiTEIResponse);

    const columnsMetaForDataFetchingArray = getColumnsQueryArgs(columnsMetaForDataFetching);
    const clientEvents = convertToClientEvents(addTEIsData(apiEvents, apiTrackedEntities), columnsMetaForDataFetchingArray);
    const clientWithSubvalues = await getSubvalues(querySingleResource, absoluteApiPath)(
        clientEvents,
        columnsMetaForDataFetchingArray,
    );
    return {
        recordContainers: clientWithSubvalues,
        request: {
            url: urlEvents,
            queryParams: queryParamsEvents,
        },
    };
};
