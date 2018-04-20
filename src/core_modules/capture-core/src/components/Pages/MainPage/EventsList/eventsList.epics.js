// @flow
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';

import log from 'loglevel';
import errorCreator from 'capture-core/utils/errorCreator';
import getEvents from '../../../../events/getEvents';
import { actionTypes as paginationActionTypes } from './Pagination/pagination.actions';
import { workingListUpdateDataRetrieved, workingListUpdateRetrievalFailed } from './eventsList.actions';

type InputObservable = rxjs$Observable<ReduxAction<any, any>>;

const errorMessages = {
    WORKING_LIST_RETRIEVE_ERROR: 'Working list could not be updated',
};

const getWorkingList = (
    programId: string,
    orgUnitId: string,
    rowsPerPage: number,
    currentPage: number,
) =>
    getEvents({
        program: programId,
        orgUnit: orgUnitId,
        pageSize: rowsPerPage,
        page: currentPage,
    });

export const updateWorkingList = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(paginationActionTypes.CHANGE_PAGE, paginationActionTypes.CHANGE_ROWS_PER_PAGE)
        .switchMap(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const { rowsPerPage, currentPage } = state.workingListsMeta.main;

            return getWorkingList(programId, orgUnitId, rowsPerPage, currentPage)
                .then(data =>
                    workingListUpdateDataRetrieved(data),
                )
                .catch((error) => {
                    log.error(errorCreator(errorMessages.WORKING_LIST_RETRIEVE_ERROR)({ error }));
                    return workingListUpdateRetrievalFailed(errorMessages.WORKING_LIST_RETRIEVE_ERROR);
                });
        });
