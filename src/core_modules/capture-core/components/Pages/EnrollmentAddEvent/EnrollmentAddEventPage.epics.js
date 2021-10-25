// @flow
import { ofType } from 'redux-observable';
import { batchActions } from 'redux-batched-actions';
import { map } from 'rxjs/operators';

import { addEnrollmentEventPageActionTypes } from './EnrollmentAddEventPageDefault/EnrollmentAddEventPageDefault.actions';
import {
    commitEnrollmentEventWithoutId,
    rollbackEnrollmentEventWithoutId,
    saveFailed,
} from '../common/EnrollmentOverviewDomain/enrollment.actions';

export const saveNewEventSucceededEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(addEnrollmentEventPageActionTypes.EVENT_SAVE_SUCCESS),
        map((action) => {
            const meta = action.meta;
            const eventId = action.payload.response.importSummaries[0].reference;
            return commitEnrollmentEventWithoutId(meta.uid, eventId);
        }),
    );

export const saveNewEventFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(addEnrollmentEventPageActionTypes.EVENT_SAVE_ERROR),
        map((action) => {
            const meta = action.meta;
            return batchActions([saveFailed(), rollbackEnrollmentEventWithoutId(meta.uid)]);
        }),
    );
