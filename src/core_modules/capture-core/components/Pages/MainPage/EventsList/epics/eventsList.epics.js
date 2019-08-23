// @flow
import { fromPromise } from 'rxjs/observable/fromPromise';
import { batchActions } from 'redux-batched-actions';
import isSelectionsEqual from '../../../../App/isSelectionsEqual';
import {
    actionTypes as mainSelectionActionTypes,
} from '../../mainSelections.actions';
import { actionTypes as paginationActionTypes } from '../Pagination/pagination.actions';
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
import { initEventWorkingListAsync } from './initEventWorkingList';
import { updateEventWorkingListAsync } from './updateEventWorkingList';

export const initEventWorkingListEpic = (action$, store: ReduxStore) =>
    action$.ofType(
        eventsListActionTypes.SET_CURRENT_WORKING_LIST_CONFIG,
        eventsListBatchActionTypes.WORKING_LIST_CONFIGS_RETRIEVED_BATCH,
    )
        .map(action => (action.type === eventsListBatchActionTypes.WORKING_LIST_CONFIGS_RETRIEVED_BATCH ?
            action.payload.find(a => a.type === eventsListActionTypes.SET_CURRENT_WORKING_LIST_CONFIG) :
            action))
        .switchMap((action) => {
            const { programId, orgUnitId, categories } = store.getState().currentSelections;
            const { eventQueryCriteria, listId } = action.payload;
            const initialPromise = initEventWorkingListAsync(eventQueryCriteria, { programId, orgUnitId, categories }, listId);
            return fromPromise(initialPromise)
                .takeUntil(
                    action$.ofType(
                        mainPageActionTypes.UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT,
                        newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST,
                        editEventDataEntryActionTypes.UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE,
                        viewEventActionTypes.UPDATE_WORKING_LIST_ON_BACK_TO_MAIN_PAGE,
                        paginationActionTypes.CHANGE_PAGE,
                        paginationActionTypes.CHANGE_ROWS_PER_PAGE,
                        eventsListActionTypes.SORT_WORKING_LIST,
                        filterSelectorActionTypes.CLEAR_FILTER,
                        filterSelectorBatchActionTypes.SET_FILTER_BATCH,
                    ),
                )
                .takeUntil(
                    action$
                        .ofType(connectivityBatchActionTypes.GOING_ONLINE_EXECUTED_BATCH)
                        .filter(actionBatch =>
                            actionBatch.payload.some(a =>
                                a.type === connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT)),
                );
        });

export const getWorkingListOnCancelSaveEpic = (action$, store: ReduxStore) =>
    action$.ofType(
        newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST,
        editEventDataEntryActionTypes.UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE,
        viewEventActionTypes.UPDATE_WORKING_LIST_ON_BACK_TO_MAIN_PAGE,
    )
        .switchMap(() => {
            const initialPromise = updateEventWorkingListAsync(store.getState());
            return fromPromise(initialPromise)
                .takeUntil(
                    action$
                        .ofType(
                            mainSelectionActionTypes.MAIN_SELECTIONS_COMPLETED,
                            mainPageActionTypes.UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT,
                            paginationActionTypes.CHANGE_PAGE,
                            paginationActionTypes.CHANGE_ROWS_PER_PAGE,
                            eventsListActionTypes.SORT_WORKING_LIST,
                            filterSelectorActionTypes.CLEAR_FILTER,
                            filterSelectorBatchActionTypes.SET_FILTER_BATCH,
                        ),
                )
                .takeUntil(
                    action$
                        .ofType(connectivityBatchActionTypes.GOING_ONLINE_EXECUTED_BATCH)
                        .filter(actionBatch =>
                            actionBatch.payload.some(
                                action => action.type === connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT)),
                );
        });

export const requestDeleteEventEpic = (action$, store: ReduxStore) =>
    action$.ofType(
        eventsListActionTypes.REQUEST_DELETE_EVENT,
    ).map((action) => {
        const state = store.getState();
        const eventId = action.payload.eventId;
        const listId = state.workingListConfigSelector.eventMainPage.currentListId;
        return batchActions([
            startDeleteEvent(eventId),
            workingListUpdatingWithDialog(listId),
        ], eventsListBatchActionTypes.START_DELETE_EVENT_UPDATE_WORKING_LIST);
    });

export const getWorkingListOnSaveEpic = (action$, store: ReduxStore) =>
    action$.ofType(
        mainPageActionTypes.UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT,
    )
        .switchMap(() => {
            const state = store.getState();
            const listId = state.workingListConfigSelector.eventMainPage.currentListId;
            const listSelections = state.workingListsContext[listId];

            const cancelActionTypes = [
                mainSelectionActionTypes.MAIN_SELECTIONS_COMPLETED,
                newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST,
                editEventDataEntryActionTypes.UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE,
                viewEventActionTypes.UPDATE_WORKING_LIST_ON_BACK_TO_MAIN_PAGE,
                paginationActionTypes.CHANGE_PAGE,
                paginationActionTypes.CHANGE_ROWS_PER_PAGE,
                eventsListActionTypes.SORT_WORKING_LIST,
                filterSelectorActionTypes.CLEAR_FILTER,
                filterSelectorBatchActionTypes.SET_FILTER_BATCH,
            ];

            if (listSelections && isSelectionsEqual(listSelections, state.currentSelections)) {
                const updatePromise = updateEventWorkingListAsync(state);
                return fromPromise(updatePromise)
                    .takeUntil(action$.ofType(...cancelActionTypes))
                    .takeUntil(
                        action$
                            .ofType(connectivityBatchActionTypes.GOING_ONLINE_EXECUTED_BATCH)
                            .filter(actionBatch =>
                                actionBatch.payload.some(
                                    action => action.type === connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT)),
                    );
            }

            const initialPromise = getWorkingListConfigsAsync(state).then(container => batchActions([
                setCurrentWorkingListConfig(container.default.id, 'eventList', container.default),
                workingListConfigsRetrieved(container.workingListConfigs),
            ], eventsListBatchActionTypes.WORKING_LIST_CONFIGS_RETRIEVED_BATCH));
            return fromPromise(initialPromise)
                .takeUntil(action$.ofType(...cancelActionTypes))
                .takeUntil(
                    action$
                        .ofType(connectivityBatchActionTypes.GOING_ONLINE_EXECUTED_BATCH)
                        .filter(actionBatch =>
                            actionBatch.payload.some(
                                action => action.type === connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT)),
                );
        });

export const updateWorkingListEpic = (action$, store: ReduxStore) =>
    action$.ofType(
        paginationActionTypes.CHANGE_PAGE,
        paginationActionTypes.CHANGE_ROWS_PER_PAGE,
        eventsListActionTypes.SORT_WORKING_LIST,
        filterSelectorActionTypes.CLEAR_FILTER,
        filterSelectorBatchActionTypes.SET_FILTER_BATCH,
        eventsListActionTypes.EVENT_DELETED,
    )
        .switchMap(() => {
            const state = store.getState();

            const updatePromise = updateEventWorkingListAsync(state);
            return fromPromise(updatePromise)
                .takeUntil(action$.ofType(
                    mainSelectionActionTypes.MAIN_SELECTIONS_COMPLETED,
                    newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST,
                    editEventDataEntryActionTypes.UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE,
                    viewEventActionTypes.UPDATE_WORKING_LIST_ON_BACK_TO_MAIN_PAGE,
                    mainPageActionTypes.UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT,
                ))
                .takeUntil(
                    action$
                        .ofType(connectivityBatchActionTypes.GOING_ONLINE_EXECUTED_BATCH)
                        .filter(actionBatch =>
                            actionBatch.payload.some(
                                action => action.type === connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT)),
                );
        });

export const getEventListOnReconnectEpic = (action$, store: ReduxStore) =>
    action$.ofType(
        connectivityBatchActionTypes.GOING_ONLINE_EXECUTED_BATCH,
    )
        .filter(actionBatch =>
            actionBatch.payload.some(action => action.type === connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT))
        .switchMap(() => {
            const state = store.getState();

            const currentSelections = {
                programId: state.currentSelections.programId,
                orgUnitId: state.currentSelections.orgUnitId,
                categories: state.currentSelections.categories,
            };
            const listId = state.workingListConfigSelector.eventMainPage.currentListId;
            const listSelections = state.workingListsContext[listId];

            const cancelActionTypes = [
                mainSelectionActionTypes.MAIN_SELECTIONS_COMPLETED,
                newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST,
                editEventDataEntryActionTypes.UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE,
                viewEventActionTypes.UPDATE_WORKING_LIST_ON_BACK_TO_MAIN_PAGE,
                mainPageActionTypes.UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT,
                paginationActionTypes.CHANGE_PAGE,
                paginationActionTypes.CHANGE_ROWS_PER_PAGE,
                eventsListActionTypes.SORT_WORKING_LIST,
                filterSelectorActionTypes.CLEAR_FILTER,
                filterSelectorBatchActionTypes.SET_FILTER_BATCH,
            ];

            if (listSelections && isSelectionsEqual(listSelections, currentSelections)) {
                const updatePromise = updateEventWorkingListAsync(state);
                return fromPromise(updatePromise)
                    .takeUntil(action$.ofType(...cancelActionTypes));
            }

            const initialPromise = getWorkingListConfigsAsync(state).then(container => batchActions([
                setCurrentWorkingListConfig(container.default.id, 'eventList', container.default),
                workingListConfigsRetrieved(container.workingListConfigs),
            ], eventsListBatchActionTypes.WORKING_LIST_CONFIGS_RETRIEVED_BATCH));
            return fromPromise(initialPromise)
                .takeUntil(action$.ofType(...cancelActionTypes));
        });
