// @flow
import { batchActions } from 'redux-batched-actions';
import { ActionsObservable } from 'redux-observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import {
    actionTypes as mainSelectionActionTypes,
} from '../../mainSelections.actions';
import { actionTypes as viewEventActionTypes } from '../../../ViewEvent/viewEvent.actions';
import { dataEntryActionTypes as newEventDataEntryActionTypes } from '../../../NewEvent';
import { getWorkingListConfigsAsync } from './workingListConfigDataRetriever';
import {
    batchActionTypes as eventsListBatchActionTypes,
    setCurrentWorkingListConfig,
    workingListConfigsRetrieved,
} from '../eventsList.actions';


export const retrieveWorkingListConfigsFromServer = (action$: ActionsObservable, store: ReduxStore) =>
    action$.ofType(
        mainSelectionActionTypes.MAIN_SELECTIONS_COMPLETED,
        viewEventActionTypes.INITIALIZE_WORKING_LISTS_ON_BACK_TO_MAIN_PAGE,
        newEventDataEntryActionTypes.CANCEL_SAVE_INITIALIZE_WORKING_LISTS,
    )
        .filter(() => {
            const state = store.getState();
            return state.offline.online;
        })
        .switchMap(() => {
            const promise = getWorkingListConfigsAsync(store.getState()).then(container => batchActions([
                setCurrentWorkingListConfig(container.default.id, 'eventList', container.default),
                workingListConfigsRetrieved(container.workingListConfigs),
            ], eventsListBatchActionTypes.WORKING_LIST_CONFIGS_RETRIEVED_BATCH));
            return fromPromise(promise);
        });

/*
export const addWorkingListConfigEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.ofType(
        eventListActionTypes.ADD_WORKING_LIST_CONFIG,
    )
        .switchMap((action) => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const selectedListId = state.workingListConfigSelector.eventMainPage.currentListId;
            const filtersByKey = state.workingListFiltersEdit[selectedListId];
            const { name, description } = action.payload;
            const workingListConfigData = {
                name,
                description,
                filtersByKey,
                programId,
            };

            const promise = addEventProgramWorkingListConfig(workingListConfigData).then((result) => {
                const s = 1;
            });
            return fromPromise(promise);
        });
*/
