// @flow
import { fromPromise } from 'rxjs/observable/fromPromise';

import log from 'loglevel';
import errorCreator from 'capture-core/utils/errorCreator';
import { getInitialWorkingListDataAsync, getUpdateWorkingListDataAsync } from './workingListDataRetriever';
import isSelectionsEqual from '../../../../App/isSelectionsEqual';

import {
    actionTypes as mainSelectionActionTypes,
    workingListInitialDataRetrieved,
    workingListInitialRetrievalFailed,
} from '../../mainSelections.actions';
import { actionTypes as paginationActionTypes } from '../Pagination/pagination.actions';
import {
    batchActionTypes as eventsListBatchActionTypes,
    actionTypes as eventsListActionTypes,
    workingListUpdateDataRetrieved,
    workingListUpdateRetrievalFailed,
    startDeleteEvent,
    workingListUpdatingWithDialog,
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
import { batchActions } from 'redux-batched-actions';

const errorMessages = {
    WORKING_LIST_RETRIEVE_ERROR: 'Working list could not be loaded',
    WORKING_LIST_UPDATE_ERROR: 'Working list could not be updated',
};


const getUnprocessedQueryArgsForInitialWorkingList = (state: ReduxState) => {
    const { programId, orgUnitId, categories } = state.currentSelections;

    const currentMeta = state.workingListsMeta.main || {};
    const nextMeta = (state.workingListsMeta.main && state.workingListsMeta.main.next) || {};
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

const getUnprocessedQueryArgsForUpdateWorkingList = (state: ReduxState) => {
    const { programId, orgUnitId, categories } = state.workingListsContext.main;

    const currentMeta = state.workingListsMeta.main;
    const nextMeta = state.workingListsMeta.main.next;
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

const getInitialWorkingListActionAsync = (
    state: ReduxState,
    customArgs?: { [id: string]: string},
): Promise<ReduxAction<any, any>> => {
    const queryArgsFromState = getUnprocessedQueryArgsForInitialWorkingList(state);
    const queryArgs = {
        ...queryArgsFromState,
        ...customArgs,
    };

    const queryArgsWithDefaultFallbacks = {
        rowsPerPage: queryArgs.rowsPerPage || 15,
        sortById: queryArgs.sortById || 'eventDate',
        sortByDirection: queryArgs.sortByDirection || 'desc',
    };

    const allQueryArgs = {
        ...queryArgs,
        ...queryArgsWithDefaultFallbacks,
    };

    const { programId, orgUnitId, categories } = allQueryArgs;

    return getInitialWorkingListDataAsync(allQueryArgs, state.workingListsColumnsOrder.main)
        .then(data =>
            workingListInitialDataRetrieved({
                ...data,
                argsWithDefaults: queryArgsWithDefaultFallbacks,
                selections: { programId, orgUnitId, categories },
            }),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_RETRIEVE_ERROR)({ error }));
            return workingListInitialRetrievalFailed(errorMessages.WORKING_LIST_RETRIEVE_ERROR);
        });
};

const getUpdateWorkingListActionAsync = (
    state: ReduxState,
    customArgs?: { [id: string]: string},
): Promise<ReduxAction<any, any>> => {
    const queryArgsFromState = getUnprocessedQueryArgsForUpdateWorkingList(state);
    const queryArgs = {
        ...queryArgsFromState,
        ...customArgs,
    };

    return getUpdateWorkingListDataAsync(queryArgs, state.workingListsColumnsOrder.main)
        .then(data =>
            workingListUpdateDataRetrieved(data),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_UPDATE_ERROR)({ error }));
            return workingListUpdateRetrievalFailed(errorMessages.WORKING_LIST_UPDATE_ERROR);
        });
};

export const retrieveWorkingListOnMainSelectionsCompletedEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        mainSelectionActionTypes.MAIN_SELECTIONS_COMPLETED,
    )
        .switchMap(() => {
            const initialPromise = getInitialWorkingListActionAsync(store.getState());
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
                            actionBatch.payload.some(action =>
                                action.type === connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT)),
                );
        });

export const getWorkingListOnCancelSaveEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST,
        editEventDataEntryActionTypes.UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE,
        viewEventActionTypes.UPDATE_WORKING_LIST_ON_BACK_TO_MAIN_PAGE,
    )
        .switchMap(() => {
            const initialPromise = getInitialWorkingListActionAsync(store.getState());
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

export const requestDeleteEventEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(
        eventsListActionTypes.REQUEST_DELETE_EVENT,
    ).map((action) => {
        const eventId = action.payload.eventId;
        return batchActions([startDeleteEvent(eventId), workingListUpdatingWithDialog()], eventsListBatchActionTypes.START_DELETE_EVENT_UPDATE_WORKING_LIST);
    });

export const getWorkingListOnSaveEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        mainPageActionTypes.UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT,
    )
        .switchMap(() => {
            const state = store.getState();
            const listSelections = state.workingListsContext.main;

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
                const updatePromise = getUpdateWorkingListActionAsync(state);
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

            const initialPromise = getInitialWorkingListActionAsync(state);
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

export const updateWorkingListEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
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
            const updatePromise = getUpdateWorkingListActionAsync(state);
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

export const getEventListOnReconnectEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
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

            const listSelections = state.workingListsContext.main;

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
                const updatePromise = getUpdateWorkingListActionAsync(state);
                return fromPromise(updatePromise)
                    .takeUntil(action$.ofType(...cancelActionTypes));
            }

            const initialPromise = getInitialWorkingListActionAsync(state);
            return fromPromise(initialPromise)
                .takeUntil(action$.ofType(...cancelActionTypes));
        });
