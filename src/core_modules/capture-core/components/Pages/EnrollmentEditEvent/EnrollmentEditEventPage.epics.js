// @flow
import { ofType } from 'redux-observable';
import { batchActions } from 'redux-batched-actions';
import { map } from 'rxjs/operators';
import { actionTypes as editActionTypes } from '../../WidgetEventEdit';
import {
    commitEnrollmentEvent,
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
