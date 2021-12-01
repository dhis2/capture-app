// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';

import {
    commitEnrollmentEventWithoutId,
    rollbackEnrollmentEventWithoutId,
    saveFailed,
} from '../../Pages/common/EnrollmentOverviewDomain/enrollment.actions';
import { addEnrollmentEventPageActionTypes } from './enrollmentAddEventPage.actions';

export const saveNewEventSucceededEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            addEnrollmentEventPageActionTypes.EVENT_SAVE_SUCCESS,
            addEnrollmentEventPageActionTypes.EVENT_SCHEDULE_SUCCESS,
        ),
        map((action) => {
            const meta = action.meta;
            const eventId = action.payload.response.importSummaries[0].reference;
            return commitEnrollmentEventWithoutId(meta.uid, eventId);
        }),
    );

export const saveNewEventFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            addEnrollmentEventPageActionTypes.EVENT_SAVE_ERROR,
            addEnrollmentEventPageActionTypes.EVENT_SCHEDULE_ERROR,
        ),
        map((action) => {
            const meta = action.meta;
            return batchActions([saveFailed(), rollbackEnrollmentEventWithoutId(meta.uid)]);
        }),
    );
