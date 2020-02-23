// @flow
import { fromPromise } from 'rxjs/observable/fromPromise';
import {
    actionTypes,
    deleteEvent,
} from '../workingLists.actions';
import { actionTypes as eventListActionTypes  } from '../../EventsList';
import { initEventWorkingListAsync } from './initEventWorkingList';
import { updateEventWorkingListAsync } from './updateEventWorkingList';
// import { paginationActionTypes } from '../../EventsList';
/*

import { batchActions } from 'redux-batched-actions';
import isSelectionsEqual from '../../../../App/isSelectionsEqual';

import {
    actionTypes as mainSelectionActionTypes,
} from '../../mainSelections.actions';

import {
    batchActionTypes as eventsListBatchActionTypes,
    actionTypes as eventsListActionTypes,
    startDeleteEvent,
    workingListUpdatingWithDialog,
    setCurrentWorkingListConfig,
    workingListConfigsRetrieved,
} from '../eventsList.actions';
import { dataEntryActionTypes as newEventDataEntryActionTypes } from '../../../NewEvent';
import { actionTypes as editEventDataEntryActionTypes } from '../../../EditEvent/DataEntry/editEventDataEntry.actions';
import { actionTypes as viewEventActionTypes } from '../../../ViewEvent/viewEvent.actions';
import {
    batchActionTypes as connectivityBatchActionTypes,
    actionTypes as connectivityActionTypes,
} from '../../../../Connectivity/connectivity.actions';
import { actionTypes as mainPageActionTypes } from '../../mainPage.actions';
import {
    actionTypes as filterSelectorActionTypes,
    batchActionTypes as filterSelectorBatchActionTypes,
} from '../FilterSelectors/filterSelector.actions';
import { getWorkingListConfigsAsync } from './workingListConfigDataRetriever';
*/
export const initEventListEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(
        actionTypes.EVENT_LIST_INIT,
    )
        .switchMap((action) => {
            const state = store.getState();
            const { programId, orgUnitId, categories } = state.currentSelections;
            const lastTransaction = state.offline.lastTransaction;
            const { selectedTemplate, defaultConfig, listId } = action.payload;
            const eventQueryCriteria = selectedTemplate.nextEventQueryCriteria || selectedTemplate.eventQueryCriteria;
            const initialPromise =
                initEventWorkingListAsync(
                    eventQueryCriteria, {
                        commonQueryData: {
                            programId,
                            orgUnitId,
                            categories,
                        },
                        defaultSpecification: defaultConfig,
                        listId,
                        lastTransaction,
                    });
            return fromPromise(initialPromise)
                .takeUntil(
                    action$
                        .ofType(actionTypes.EVENT_LIST_INIT_CANCEL)
                        .filter(cancelAction => cancelAction.payload.listId === listId),
                );
        });

export const updateEventListEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(
        actionTypes.EVENT_LIST_UPDATE,
    )
        .switchMap((action) => {
            const state = store.getState();
            const { listId, queryArgs } = action.payload;
            const updatePromise = updateEventWorkingListAsync(listId, queryArgs, state);
            return fromPromise(updatePromise)
                .takeUntil(
                    action$
                        .ofType(actionTypes.EVENT_LIST_UPDATE_CANCEL)
                        .filter(cancelAction => cancelAction.payload.listId === listId),
                );
        });

// TODO: --------------------------------- REFACTOR -----------------------------------
export const requestDeleteEventEpic = (action$: InputObservable) =>
    action$.ofType(
        eventListActionTypes.REQUEST_DELETE_EVENT,
    ).map((action) => {
        const eventId = action.payload.eventId;
        const listId = 'eventList';
        return deleteEvent(eventId, listId);
    });
