// @flow
import { fromPromise } from 'rxjs/observable/fromPromise';

import log from 'loglevel';
import errorCreator from 'capture-core/utils/errorCreator';
import { getEvents } from '../../../../events/eventRequests';
import getColumnsConfiguration from './getColumnsConfiguration';
import isSelectionsEqual from '../../../App/isSelectionsEqual';

import {
    actionTypes as mainSelectionActionTypes,
    workingListInitialDataRetrieved,
    workingListInitialRetrievalFailed,
} from '../mainSelections.actions';
import { actionTypes as paginationActionTypes } from './Pagination/pagination.actions';
import {
    actionTypes as eventsListActionTypes,
    workingListUpdateDataRetrieved,
    workingListUpdateRetrievalFailed,
} from './eventsList.actions';
import { actionTypes as newEventDataEntryActionTypes } from '../../NewEvent/DataEntry/newEventDataEntry.actions';
import { actionTypes as editEventDataEntryActionTypes } from '../../EditEvent/DataEntry/editEventDataEntry.actions';
import {
    batchActionTypes as connectivityBatchActionTypes,
    actionTypes as connectivityActionTypes,
} from '../../../Connectivity/connectivity.actions';
import { actionTypes as mainPageActionTypes } from '../mainPage.actions';

const errorMessages = {
    WORKING_LIST_RETRIEVE_ERROR: 'Working list could not be loaded',
    WORKING_LIST_UPDATE_ERROR: 'Working list could not be updated',
};

const getInitialWorkingListDataAsync = async (programId: string, orgUnitId: string) => {
    const eventsPromise = getEvents({
        program: programId,
        orgUnit: orgUnitId,
        pageSize: 15,
        order: 'eventDate:desc',
    });

    const columnsConfigPromise = getColumnsConfiguration(programId);

    const promiseData = await Promise.all([
        eventsPromise,
        columnsConfigPromise,
    ]);

    return {
        ...promiseData[0],
        columnsOrder: promiseData[1],
    };
};

const getUpdateWorkingListDataAsync = (
    programId: string,
    orgUnitId: string,
    rowsPerPage: number,
    currentPage: number,
    sortById: string,
    sortByDirection: string,
) =>
    getEvents({
        program: programId,
        orgUnit: orgUnitId,
        pageSize: rowsPerPage,
        page: currentPage,
        order: `${sortById}:${sortByDirection}`,
    });

const getInitialWorkingListActionAsync = (
    programId: string,
    orgUnitId: string): Promise<ReduxAction<any, any>> =>
    getInitialWorkingListDataAsync(programId, orgUnitId)
        .then(data =>
            workingListInitialDataRetrieved({ ...data, selections: { programId, orgUnitId } }),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_RETRIEVE_ERROR)({ error }));
            return workingListInitialRetrievalFailed(errorMessages.WORKING_LIST_RETRIEVE_ERROR);
        });

const getUpdateWorkingListActionAsync = (
    programId: string,
    orgUnitId: string,
    rowsPerPage: number,
    currentPage: number,
    sortById: string,
    sortByDirection: string): Promise<ReduxAction<any, any>> =>
    getUpdateWorkingListDataAsync(programId, orgUnitId, rowsPerPage, currentPage, sortById, sortByDirection)
        .then(data =>
            workingListUpdateDataRetrieved(data),
        )
        .catch((error) => {
            log.error(errorCreator(errorMessages.WORKING_LIST_UPDATE_ERROR)({ error }));
            return workingListUpdateRetrievalFailed(errorMessages.WORKING_LIST_UPDATE_ERROR);
        });

const getArgumentsForUpdateWorkingListFromState = (state: ReduxState) => {
    const { programId, orgUnitId } = state.workingListsContext.main;

    const currentMeta = state.workingListsMeta.main;
    const nextMeta = state.workingListsMeta.main.next;
    const { rowsPerPage, currentPage, sortById, sortByDirection } = {
        ...currentMeta,
        ...nextMeta,
    };

    return [
        programId,
        orgUnitId,
        rowsPerPage,
        currentPage,
        sortById,
        sortByDirection,
    ];
};

export const retrieveWorkingListOnMainSelectionsCompletedEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        mainSelectionActionTypes.MAIN_SELECTIONS_COMPLETED,
    )
        .switchMap(() => {
            const { programId, orgUnitId } = store.getState().currentSelections;

            const initialPromise = getInitialWorkingListActionAsync(programId, orgUnitId);
            return fromPromise(initialPromise)
                .takeUntil(
                    action$.ofType(
                        mainPageActionTypes.UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT,
                        newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST,
                        editEventDataEntryActionTypes.UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE,
                        paginationActionTypes.CHANGE_PAGE,
                        paginationActionTypes.CHANGE_ROWS_PER_PAGE,
                        eventsListActionTypes.SORT_WORKING_LIST,
                    ),
                )
                .takeUntil(
                    action$
                        .ofType(connectivityBatchActionTypes.GOING_ONLINE_EXECUTED_BATCH)
                        .filter(actionBatch =>
                            actionBatch.payload.some(action => action.type === connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT)),
                );
        });

export const getWorkingListOnCancelSaveEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST,
        editEventDataEntryActionTypes.UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE,
    )
        .switchMap(() => {
            const { programId, orgUnitId } = store.getState().currentSelections;

            const initialPromise = getInitialWorkingListActionAsync(programId, orgUnitId);
            return fromPromise(initialPromise)
                .takeUntil(
                    action$
                        .ofType(
                            mainSelectionActionTypes.MAIN_SELECTIONS_COMPLETED,
                            mainPageActionTypes.UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT,
                            paginationActionTypes.CHANGE_PAGE,
                            paginationActionTypes.CHANGE_ROWS_PER_PAGE,
                            eventsListActionTypes.SORT_WORKING_LIST,
                        ),
                )
                .takeUntil(
                    action$
                        .ofType(connectivityBatchActionTypes.GOING_ONLINE_EXECUTED_BATCH)
                        .filter(actionBatch =>
                            actionBatch.payload.some(action => action.type === connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT)),
                );
        });

export const getWorkingListOnSaveEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        mainPageActionTypes.UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT,
    )
        .switchMap(() => {
            const state = store.getState();
            const listSelections = state.workingListsContext.main;
            const programId = state.currentSelections.programId;
            const orgUnitId = state.currentSelections.orgUnitId;

            const cancelActionTypes = [
                mainSelectionActionTypes.MAIN_SELECTIONS_COMPLETED,
                newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST,
                editEventDataEntryActionTypes.UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE,
                paginationActionTypes.CHANGE_PAGE,
                paginationActionTypes.CHANGE_ROWS_PER_PAGE,
                eventsListActionTypes.SORT_WORKING_LIST,
            ];

            if (listSelections && isSelectionsEqual(state.currentSelections, listSelections)) {
                const argsForUpdate = getArgumentsForUpdateWorkingListFromState(state);
                const updatePromise = getUpdateWorkingListActionAsync(...argsForUpdate);
                return fromPromise(updatePromise)
                    .takeUntil(action$.ofType(...cancelActionTypes))
                    .takeUntil(
                        action$
                            .ofType(connectivityBatchActionTypes.GOING_ONLINE_EXECUTED_BATCH)
                            .filter(actionBatch =>
                                actionBatch.payload.some(action => action.type === connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT)),
                    );
            }

            const initialPromise = getInitialWorkingListActionAsync(programId, orgUnitId);
            return fromPromise(initialPromise)
                .takeUntil(action$.ofType(...cancelActionTypes))
                .takeUntil(
                    action$
                        .ofType(connectivityBatchActionTypes.GOING_ONLINE_EXECUTED_BATCH)
                        .filter(actionBatch =>
                            actionBatch.payload.some(action => action.type === connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT)),
                );
        });

export const updateWorkingListEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        paginationActionTypes.CHANGE_PAGE,
        paginationActionTypes.CHANGE_ROWS_PER_PAGE,
        eventsListActionTypes.SORT_WORKING_LIST,
    )
        .switchMap((action) => {
            const state = store.getState();
            const argsForUpdate = getArgumentsForUpdateWorkingListFromState(state);
            const updatePromise = getUpdateWorkingListActionAsync(...argsForUpdate);
            return fromPromise(updatePromise)
                .takeUntil(action$.ofType(
                    mainSelectionActionTypes.MAIN_SELECTIONS_COMPLETED,
                    newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST,
                    editEventDataEntryActionTypes.UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE,
                    mainPageActionTypes.UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT,
                ))
                .takeUntil(
                    action$
                        .ofType(connectivityBatchActionTypes.GOING_ONLINE_EXECUTED_BATCH)
                        .filter(actionBatch =>
                            actionBatch.payload.some(action => action.type === connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT)),
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
            };

            const listSelections = state.workingListsContext.main;

            const cancelActionTypes = [
                mainSelectionActionTypes.MAIN_SELECTIONS_COMPLETED,
                newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST,
                editEventDataEntryActionTypes.UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE,
                mainPageActionTypes.UPDATE_EVENT_LIST_AFTER_SAVE_OR_UPDATE_FOR_SINGLE_EVENT,
                paginationActionTypes.CHANGE_PAGE,
                paginationActionTypes.CHANGE_ROWS_PER_PAGE,
                eventsListActionTypes.SORT_WORKING_LIST,
            ];

            if (listSelections && isSelectionsEqual(currentSelections, listSelections)) {
                const argsForUpdate = getArgumentsForUpdateWorkingListFromState(state);
                const updatePromise = getUpdateWorkingListActionAsync(...argsForUpdate);
                return fromPromise(updatePromise)
                    .takeUntil(action$.ofType(...cancelActionTypes));
            }

            const initialPromise = getInitialWorkingListActionAsync(currentSelections.programId, currentSelections.orgUnitId);
            return fromPromise(initialPromise)
                .takeUntil(action$.ofType(...cancelActionTypes));
        });
