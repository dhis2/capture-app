// @flow
import { ofType } from 'redux-observable';
import { batchActions } from 'redux-batched-actions';
import { map } from 'rxjs/operators';

import { addEnrollmentEventPageActionTypes } from './enrollmentAddEventPage.actions';
import {
    commitEnrollmentEventWithoutId,
    rollbackEnrollmentEventWithoutId,
    saveFailed,
} from '../../Pages/common/EnrollmentOverviewDomain/enrollment.actions';

export const saveNewEventSucceededEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            addEnrollmentEventPageActionTypes.EVENT_SAVE_SUCCESS,
            addEnrollmentEventPageActionTypes.EVENT_SCHEDULE_SUCCESS,
        ),
        map((action) => {
            const meta = action.meta;
            const eventId = action.payload.bundleReport.typeReportMap.EVENT.objectReports[0].uid;
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
