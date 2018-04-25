// @flow
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concatMap';
import log from 'loglevel';
import { ensureState } from 'redux-optimistic-ui';
import errorCreator from '../../utils/errorCreator';

import getEnrollmentEvents from '../../events/getEnrollmentEvents';
import { loadDataEntryEvent } from '../../components/DataEntry/actions/dataEntryLoad.actions';
import { actionTypes, enrollmentLoaded, enrollmentLoadFailed } from './enrollment.actions';

type InputObservable = rxjs$Observable<ReduxAction<any, any>>;

const errorMessages = {
    EVENTS_LOG: 'Events could not be loaded',
    EVENTS_SCREEN: 'Events could not be loaded. See log for details',
};

function convertStatusIn(value: string) {
    if (value === 'COMPLETED') {
        return 'true';
    }
    return null;
}

function convertStatusOut(dataEntryValue: string, prevValue: string) {
    if (dataEntryValue === 'true' && prevValue !== 'COMPLETED') {
        return 'COMPLETED';
    } else if (!dataEntryValue && prevValue === 'COMPLETED') {
        return 'ACTIVE';
    }
    return prevValue;
}

export const loadEnrollmentData = (action$: InputObservable) =>
    action$.ofType(actionTypes.START_ENROLLMENT_LOAD)
        .concatMap(() =>
            getEnrollmentEvents()
                .then(events =>
                    enrollmentLoaded(events))
                .catch((error) => {
                    log.error(errorCreator(errorMessages.EVENTS_LOG)({ error }));
                    return enrollmentLoadFailed(errorMessages.EVENTS_SCREEN);
                }),
        );

export const loadDataEntryData = (action$: InputObservable, store: ReduxStore) =>
    action$.ofType(actionTypes.ENROLLMENT_LOADED)
        .map(() => {
            const events = ensureState(store.getState().events);
            const firstEventKey = Object.keys(events)[0];

            return loadDataEntryEvent(
                firstEventKey,
                store.getState(),
                [
                    {
                        id: 'eventDate',
                        type: 'DATE',
                    },
                    {
                        inId: 'status',
                        outId: 'complete',
                        onConvertIn: convertStatusIn,
                        onConvertOut: convertStatusOut,
                    },
                ], 'main');
        });
