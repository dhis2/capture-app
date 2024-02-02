// @flow
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import { convertToClientEvents } from './convertToClientEvents';
import {
    getSubvalues,
    getApiFilterQueryArgs,
    getMainApiFilterQueryArgs,
    getApiFilterAttributesQueryArgs,
    splitFilters,
} from '../getListDataCommon';
import type { RawQueryArgs } from './types';
import type { InputMeta } from './getEventListData.types';
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching } from '../../../../types';
import { addTEIsData } from './addTEIsData';
import { getColumnsQueryArgs, getOrderQueryArgs } from './getColumnsQueryArgs';
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
        order: getOrderQueryArgs(sortById, sortByDirection),
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
    const { resource: resourceEvents, queryArgs: queryArgsEvents } = {
        resource: 'tracker/events',
        queryArgs: createApiEventQueryArgs(rawQueryArgs, columnsMetaForDataFetching, filtersOnlyMetaForDataFetching),
    };
    const apiEventsResponse = await querySingleResource({
        resource: resourceEvents,
        params: queryArgsEvents,
    });
    const apiEvents = handleAPIResponse(REQUESTED_ENTITIES.events, apiEventsResponse);

    const trackedEntityIds = apiEvents
        .reduce((acc, { trackedEntity }) => (acc.includes(trackedEntity) ? acc : [...acc, trackedEntity]), [])
        .join(';');

    const { resource: resourceTEIs, queryArgs: queryArgsTEIs } = {
        resource: 'tracker/trackedEntities',
        queryArgs: createApiTEIsQueryArgs(rawQueryArgs, trackedEntityIds),
    };
    const apiTEIResponse = await querySingleResource({
        resource: resourceTEIs,
        params: queryArgsTEIs,
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
            resource: resourceEvents,
            queryArgs: queryArgsEvents,
        },
    };
};
