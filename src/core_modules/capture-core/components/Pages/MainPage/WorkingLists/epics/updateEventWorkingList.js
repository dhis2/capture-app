// @flow
import log from 'loglevel';
import { errorCreator, pipe } from 'capture-core-utils';
import { getEventWorkingListDataAsync } from './eventsRetriever';
import {
    updateEventListSuccess,
    updateEventListError,
} from '../workingLists.actions';
import { buildQueryArgs } from './eventsQueryArgsBuilder';


const errorMessages = {
    WORKING_LIST_UPDATE_ERROR: 'Working list could not be updated',
};

const getSourceQueryArgsForUpdateWorkingList = (state: ReduxState, listId: string) => {
    const { programId, orgUnitId, categories } = state.workingListsContext[listId];

    const currentMeta = state.workingListsMeta[listId];
    const nextMeta = state.workingListsMeta[listId].next;
    const meta = {
        ...currentMeta,
        ...nextMeta,
        filters: {
            ...currentMeta.filters,
            ...nextMeta.filters,
        },
    };
    meta.hasOwnProperty('next') && delete meta.next;

    return {
        programId,
        orgUnitId,
        categories,
        ...meta,
    };
};

export const updateEventWorkingListAsync = (
    state: ReduxState,
): Promise<ReduxAction<any, any>> => {
    const listId = state.workingListsTemplates.eventList.currentListId;
    const sourceQueryData = getSourceQueryArgsForUpdateWorkingList(state, listId);
    const columnOrder = state.workingListsColumnsOrder[listId];
    const mainColumnTypes = pipe(
        columns => columns.filter(column => column.isMainProperty),
        columOrderMainOnly => columOrderMainOnly.reduce((acc, column) => ({
            ...acc,
            [column.id]: column.type,
        }), {}),
    )(columnOrder);

    return getEventWorkingListDataAsync(
        buildQueryArgs(
            sourceQueryData,
            {
                listId,
                mainPropTypes: mainColumnTypes,
                isInit: false,
            }),
        columnOrder)
        .then(data =>
            updateEventListSuccess(listId, data),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_UPDATE_ERROR)({ error }));
            return updateEventListError(listId, errorMessages.WORKING_LIST_UPDATE_ERROR);
        });
};
