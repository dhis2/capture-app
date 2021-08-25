// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { addEnrollmentEventPageActionTypes } from './enrollmentAddEventPage.actions';

export const saveAddEnrollmentEventLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(addEnrollmentEventPageActionTypes.EVENT_SAVE),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId, enrollmentId } = state.router.location.query;
            return push(`/enrollment?programId=${programId}&orgUnitId=${orgUnitId}&enrollmentId=${enrollmentId}`);
        }));

export const cancelAddEnrollmentEventLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(addEnrollmentEventPageActionTypes.EVENT_SAVE_CANCEL),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId, enrollmentId } = state.router.location.query;
            return push(`/enrollment?enrollment=${programId}&orgUnitId=${orgUnitId}&enrollmentId=${enrollmentId}`);
        }));
