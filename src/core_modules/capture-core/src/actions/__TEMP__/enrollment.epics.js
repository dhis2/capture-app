// @flow
/* eslint-disable import/prefer-default-export */
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';

import getEnrollmentEvents from '../../events/getEnrollmentEvents';
import { loadDataEntryEvent } from '../../components/DataEntry/actions/dataEntry.actions';
import { actionTypes, enrollmentLoaded } from './enrollment.actions';

function convertStatusToForm(input: string) {
    if (input === 'COMPLETED') {
        return 'true';
    }
    return null;
}

function convertStatusFromForm(formValue: string, inputValue: string) {
    if (formValue === 'true') {
        return 'COMPLETED';
    } else if (!formValue && inputValue === 'COMPLETED') {
        return 'OPEN';
    }
    return inputValue;
}

export const loadEnrollmentData = action$ =>
    action$.ofType(actionTypes.START_ENROLLMENT_LOAD)
        .concatMap(action =>
            getEnrollmentEvents()
                .then(events => enrollmentLoaded(events)));

export const loadDataEntryData = (action$, store: ReduxStore) =>
    action$.ofType(actionTypes.ENROLLMENT_LOADED)
        .map((action) => {
            if (action.payload && action.payload.length > 0) {
                return loadDataEntryEvent('qEHQdXkUAGk', store.getState(), [{ id: 'eventDate', type: 'DATE' }, { id: 'status', onConvertValue: convertStatusToForm }], 'main');
            }
            return loadDataEntryEvent('qEHQdXkUAGk', store.getState(), [{ id: 'eventDate', type: 'DATE' }, { id: 'status', type: 'TEXT' }], 'main');
        });

