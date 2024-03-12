// @flow
import { ofType } from 'redux-observable';
import { batchActions } from 'redux-batched-actions';
import { map } from 'rxjs/operators';
import { actionTypes as editActionTypes } from '../../WidgetEventEdit';
import {
    commitEnrollmentAndEvents,
    commitEnrollmentEvent,
    rollbackEnrollmentAndEvents,
    rollbackEnrollmentEvent,
    saveFailed,
} from '../common/EnrollmentOverviewDomain/enrollment.actions';


export const updateEventSucceededEpic = (action$: InputObservable) =>
    action$.pipe(ofType(editActionTypes.EVENT_SCHEDULE_SUCCESS), map((action) => {
        const { eventId } = action.meta;
        return commitEnrollmentEvent(eventId);
    }));

export const updateEventFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(
            editActionTypes.EVENT_SCHEDULE_ERROR,
        ),
        map((action) => {
            const { eventId } = action.meta;
            return batchActions([saveFailed(), rollbackEnrollmentEvent(eventId)]);
        }),
    );
export const saveEventAndCompleteEnrollmentSucceededEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(editActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_SUCCESS),
        map((action) => {
            const meta = action.meta;
            // the bundleReport returns the events in the same order as the payload order. Therefore, we know that the first event is the newly added one.
            const eventId = action.payload.bundleReport.typeReportMap.EVENT.objectReports[0].uid;
            return commitEnrollmentAndEvents(meta.uid, eventId);
        }),
    );
export const saveEventAndCompleteEnrollmentFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(editActionTypes.EVENT_SAVE_ENROLLMENT_COMPLETE_ERROR),
        map((action) => {
            const meta = action.meta;
            return batchActions(
                [saveFailed(), rollbackEnrollmentAndEvents(meta.uid)],
                'EditEvent.saveEventAndCompleteEnrollmentFailed',
            );
        }),
    );
