// @flow
import log from 'loglevel';
import errorCreator from '../../utils/errorCreator';

import getEnrollmentEvents from '../../events/getEnrollmentEvents';
import { loadDataEntryEvent } from '../../components/DataEntry/actions/dataEntryLoadEdit.actions';
import { actionTypes, enrollmentLoaded, enrollmentLoadFailed } from './enrollment.actions';

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
            const events = store.getState().events;
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
                        clientId: 'status',
                        dataEntryId: 'complete',
                        onConvertIn: convertStatusIn,
                        onConvertOut: convertStatusOut,
                    },
                ], 'main');
        });
