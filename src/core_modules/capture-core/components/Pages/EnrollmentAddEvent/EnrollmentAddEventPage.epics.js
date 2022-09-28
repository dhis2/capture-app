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
