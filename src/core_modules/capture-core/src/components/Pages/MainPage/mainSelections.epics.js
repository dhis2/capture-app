// @flow
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';

import log from 'loglevel';
import errorCreator from 'capture-core/utils/errorCreator';
import { actionTypes, workingListDataRetrieved, workingListRetrievalFailed } from './mainSelections.actions';
import getEvents from '../../../events/getEvents';

type InputObservable = rxjs$Observable<ReduxAction<any, any>>;

const errorMessages = {
    WORKING_LIST_RETRIEVE_ERROR: 'Working list could not be loaded',
};

const getWorkingList = (programId: string, orgUnitId: string) =>
    getEvents({
        program: programId,
        orgUnit: orgUnitId,
    });

export const retrieveWorkingListEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.UPDATE_MAIN_SELECTIONS)
        .filter(() => {
            const { programId, orgUnitId } = store.getState().currentSelections;
            return programId && orgUnitId;
        })
        .switchMap(() => {
            const { programId, orgUnitId } = store.getState().currentSelections;
            return getWorkingList(programId, orgUnitId)
                .then(events =>
                    workingListDataRetrieved(events),
                )
                .catch((error) => {
                    log.error(errorCreator(errorMessages.WORKING_LIST_RETRIEVE_ERROR)({ error }));
                    return workingListRetrievalFailed(errorMessages.WORKING_LIST_RETRIEVE_ERROR);
                });
        });
