// @flow
import { fromPromise } from 'rxjs/observable/fromPromise';
import i18n from '@dhis2/d2-i18n';
import log from 'loglevel';
import { batchActions } from 'redux-batched-actions';
import { ActionsObservable } from 'redux-observable';
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
    setCurrentWorkingList,
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
import {
    getEventProgramWorkingListConfigs,
} from '../../../../../eventWorkingListConfig/eventWorkingListConfigRequests';

const errorMessages = {
    WORKING_LIST_RETRIEVE_ERROR: 'Working list could not be loaded',
    WORKING_LIST_UPDATE_ERROR: 'Working list could not be updated',
};


const getUnprocessedQueryArgsForInitialWorkingList = (state: ReduxState) => {
    const { programId, orgUnitId, categories } = state.currentSelections;
    const listId = state.workingListConfigSelector.eventMainPage.currentWorkingListId;

    const currentMeta = state.workingListsMeta[listId] || {};
    const nextMeta = (state.workingListsMeta[listId] && state.workingListsMeta[listId].next) || {};
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
    const listId = state.workingListConfigSelector.eventMainPage.currentWorkingListId;
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
    const listId = state.workingListConfigSelector.eventMainPage.currentWorkingListId;

    return getInitialWorkingListDataAsync(allQueryArgs, state.workingListsColumnsOrder[listId])
        .then(data =>
            workingListInitialDataRetrieved(listId, {
                ...data,
                argsWithDefaults: queryArgsWithDefaultFallbacks,
                selections: { programId, orgUnitId, categories },
            }),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_RETRIEVE_ERROR)({ error }));
            return workingListInitialRetrievalFailed(listId, errorMessages.WORKING_LIST_RETRIEVE_ERROR);
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
    const listId = state.workingListConfigSelector.eventMainPage.currentWorkingListId;
    return getUpdateWorkingListDataAsync(queryArgs, state.workingListsColumnsOrder[listId])
        .then(data =>
            workingListUpdateDataRetrieved(listId, data),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_UPDATE_ERROR)({ error }));
            return workingListUpdateRetrievalFailed(listId, errorMessages.WORKING_LIST_UPDATE_ERROR);
        });
};

const getWorkingListConfigsAsync = (state: ReduxState) => {
    const programId = state.currentSelections.programId;
    return getEventProgramWorkingListConfigs(programId).then((workingListConfigs) => {
        const defaultWorkingListConfig = {
            id: `${programId}-default`,
            name: 'default',
            sortById: 'eventDate',
            sortByDirection: 'desc',
        };
        const workingListConfigsWithDefault = [defaultWorkingListConfig, ...workingListConfigs];
        return batchActions([
            setCurrentWorkingList(defaultWorkingListConfig.id, defaultWorkingListConfig),
            workingListConfigsRetrieved(workingListConfigsWithDefault),
        ], eventsListBatchActionTypes.WORKING_LIST_CONFIGS_RETRIEVED_BATCH);
    });
};

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
            const promise = getWorkingListConfigsAsync(store.getState());
            return fromPromise(promise);
        });


export const retrieveCurrentWorkingListDataEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.ofType(
        eventsListActionTypes.SET_CURRENT_WORKING_LIST_CONFIG,
        eventsListBatchActionTypes.WORKING_LIST_CONFIGS_RETRIEVED_BATCH,
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

export const getWorkingListOnCancelSaveEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.ofType(
        newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST,
        editEventDataEntryActionTypes.UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE,
        viewEventActionTypes.UPDATE_WORKING_LIST_ON_BACK_TO_MAIN_PAGE,
    )
        .switchMap(() => {
            const initialPromise = getUpdateWorkingListActionAsync(store.getState());
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

export const requestDeleteEventEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.ofType(
        eventsListActionTypes.REQUEST_DELETE_EVENT,
    ).map((action) => {
        const state = store.getState();
        const eventId = action.payload.eventId;
        const listId = state.workingListConfigSelector.eventMainPage.currentWorkingListId;
        return batchActions([
            startDeleteEvent(eventId),
            workingListUpdatingWithDialog(listId),
        ], eventsListBatchActionTypes.START_DELETE_EVENT_UPDATE_WORKING_LIST);
    });

export const getWorkingListOnSaveEpic = (action$: ActionsObservable, store: ReduxStore) =>
    action$.ofType(
        mainPageActionTypes.UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT,
    )
        .switchMap(() => {
            const state = store.getState();
            const listId = state.workingListConfigSelector.eventMainPage.currentWorkingListId;
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

            const initialPromise = getWorkingListConfigsAsync(state);
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

export const updateWorkingListEpic = (action$: ActionsObservable, store: ReduxStore) =>
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

export const getEventListOnReconnectEpic = (action$: ActionsObservable, store: ReduxStore) =>
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
            const listId = state.workingListConfigSelector.eventMainPage.currentWorkingListId;
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
                const updatePromise = getUpdateWorkingListActionAsync(state);
                return fromPromise(updatePromise)
                    .takeUntil(action$.ofType(...cancelActionTypes));
            }

            const initialPromise = getWorkingListConfigsAsync(state);
            return fromPromise(initialPromise)
                .takeUntil(action$.ofType(...cancelActionTypes));
        });
