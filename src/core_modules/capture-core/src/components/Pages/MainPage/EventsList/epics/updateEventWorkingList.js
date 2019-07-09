// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getEventWorkingListDataAsync } from './eventsRetriever';
import {
    workingListUpdateDataRetrieved,
    workingListUpdateRetrievalFailed,
} from '../eventsList.actions';


const errorMessages = {
    WORKING_LIST_UPDATE_ERROR: 'Working list could not be updated',
};

const getUnprocessedQueryArgsForUpdateWorkingList = (state: ReduxState, listId: string) => {
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
    const listId = state.workingListConfigSelector.eventMainPage.currentListId;
    const queryData = getUnprocessedQueryArgsForUpdateWorkingList(state, listId);
    const columnOrder = state.workingListColumns[listId];

    return getEventWorkingListDataAsync(queryData, columnOrder)
        .then(data =>
            workingListUpdateDataRetrieved(listId, data),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_UPDATE_ERROR)({ error }));
            return workingListUpdateRetrievalFailed(listId, errorMessages.WORKING_LIST_UPDATE_ERROR);
        });
};
