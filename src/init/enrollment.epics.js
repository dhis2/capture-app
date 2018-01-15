// @flow
/* eslint-disable import/prefer-default-export */
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';

import getEnrollmentEvents from 'capture-core/events/getEnrollmentEvents';
import { actionTypes, enrollmentLoaded } from './enrollment.actions';
import { openForm } from 'capture-core/actions/form.actions';


export const loadEnrollmentData = action$ =>
    action$.ofType(actionTypes.START_ENROLLMENT_LOAD)
        .concatMap(action => getEnrollmentEvents()
            .then(events => enrollmentLoaded(events)));

export const loadFormData = (action$, store: ReduxStore) =>
    action$.ofType(actionTypes.ENROLLMENT_LOADED)
        .map((action) => {
            if (action.payload && action.payload > 0) {
                return openForm(action.payload[0].id, store);
            }
            return openForm(action.payload[0].id, store);
        });

