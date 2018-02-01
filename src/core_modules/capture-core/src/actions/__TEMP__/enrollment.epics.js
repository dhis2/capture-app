// @flow
/* eslint-disable import/prefer-default-export */
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';

import getEnrollmentEvents from '../../events/getEnrollmentEvents';
import { loadDataEntryEvent } from '../../components/DataEntry/actions/dataEntry.actions';
import { actionTypes, enrollmentLoaded } from './enrollment.actions';


export const loadEnrollmentData = action$ =>
    action$.ofType(actionTypes.START_ENROLLMENT_LOAD)
        .concatMap(action =>
            getEnrollmentEvents()
                .then(events => enrollmentLoaded(events)));

export const loadDataEntryData = (action$, store: ReduxStore) =>
    action$.ofType(actionTypes.ENROLLMENT_LOADED)
        .map((action) => {
            if (action.payload && action.payload > 0) {
                return loadDataEntryEvent(action.payload[0].id, store.getState());
            }
            return loadDataEntryEvent(action.payload[0].id, store.getState());
        });

