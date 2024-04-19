// @flow
import { ofType } from 'redux-observable';
import { batchActions } from 'redux-batched-actions';
import { map } from 'rxjs/operators';
import {
    addEnrollmentEventPageDefaultActionTypes,
} from './EnrollmentAddEventPageDefault/EnrollmentAddEventPageDefault.actions';
import {
    commitEnrollmentEventWithoutId,
    rollbackEnrollmentEventWithoutId,
    saveFailed,
    commitEnrollmentAndEvents,
    rollbackEnrollmentAndEvents,
} from '../common/EnrollmentOverviewDomain/enrollment.actions';

export const saveNewEventSucceededEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_SUCCESS,
            addEnrollmentEventPageDefaultActionTypes.EVENT_SCHEDULE_SUCCESS,
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
            addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_ERROR,
            addEnrollmentEventPageDefaultActionTypes.EVENT_SCHEDULE_ERROR,
        ),
        map((action) => {
            const meta = action.meta;
            return batchActions([saveFailed(), rollbackEnrollmentEventWithoutId(meta.uid)]);
        }),
    );

export const saveEventAndCompleteEnrollmentSucceededEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_SUCCESS),
        map((action) => {
            const meta = action.meta;
            // the bundleReport returns the events in the same order as the payload order. Therefore, we know that the first event is the newly added one.
            const eventId = action.payload.bundleReport.typeReportMap.EVENT.objectReports[0].uid;
            return commitEnrollmentAndEvents(meta.uid, eventId);
        }),
    );

export const saveEventAndCompleteEnrollmentFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(addEnrollmentEventPageDefaultActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_ERROR),
        map((action) => {
            const meta = action.meta;
            return batchActions(
                [saveFailed(), rollbackEnrollmentAndEvents(meta.uid)],
                'NewEvent.saveEventAndCompleteEnrollmentFailed',
            );
        }),
    );
