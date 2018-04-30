// @flow
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/concatMap';

import log from 'loglevel';
import errorCreator from 'capture-core/utils/errorCreator';
import getEvents from '../../../../events/getEvents';
import getColumnsConfiguration from './getColumnsConfiguration';

import { actionTypes as mainSelectionActionTypes, workingListInitialDataRetrieved, workingListInitialRetrievalFailed } from '../mainSelections.actions';
import { actionTypes as paginationActionTypes } from './Pagination/pagination.actions';
import { actionTypes as eventsListActionTypes, workingListUpdateDataRetrieved, workingListUpdateRetrievalFailed } from './eventsList.actions';

type InputObservable = rxjs$Observable<ReduxAction<any, any>>;

const errorMessages = {
    WORKING_LIST_RETRIEVE_ERROR: 'Working list could not be loaded',
    WORKING_LIST_UPDATE_ERROR: 'Working list could not be updated',
};

const getWorkingList = async (programId: string, orgUnitId: string) => {
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

export const retrieveWorkingListEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(mainSelectionActionTypes.MAIN_SELECTIONS_COMPLETED)
        .switchMap(() => {
            const { programId, orgUnitId } = store.getState().currentSelections;
            return getWorkingList(programId, orgUnitId)
                .then(data =>
                    workingListInitialDataRetrieved(data),
                )
                .catch((error) => {
                    log.error(errorCreator(errorMessages.WORKING_LIST_RETRIEVE_ERROR)({ error }));
                    return workingListInitialRetrievalFailed(errorMessages.WORKING_LIST_RETRIEVE_ERROR);
                });
        });

const updateWorkingList = (
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

export const updateWorkingListEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(paginationActionTypes.CHANGE_PAGE, paginationActionTypes.CHANGE_ROWS_PER_PAGE, eventsListActionTypes.SORT_WORKING_LIST)
        .switchMap(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const { rowsPerPage, currentPage, sortById, sortByDirection } = state.workingListsMeta.main;

            return updateWorkingList(programId, orgUnitId, rowsPerPage, currentPage, sortById, sortByDirection)
                .then(data =>
                    workingListUpdateDataRetrieved(data),
                )
                .catch((error) => {
                    log.error(errorCreator(errorMessages.WORKING_LIST_UPDATE_ERROR)({ error }));
                    return workingListUpdateRetrievalFailed(errorMessages.WORKING_LIST_UPDATE_ERROR);
                });
        });
