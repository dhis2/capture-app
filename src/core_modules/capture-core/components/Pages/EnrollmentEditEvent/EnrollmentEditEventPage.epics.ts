import { ofType } from 'redux-observable';
import { batchActions } from 'redux-batched-actions';
import { map } from 'rxjs/operators';
import type { EpicAction } from 'capture-core-utils/types';
import { actionTypes as editActionTypes } from '../../WidgetEventEdit';
import {
    commitEnrollmentEvent,
    rollbackEnrollmentEvent,
    saveFailed,
} from '../common/EnrollmentOverviewDomain/enrollment.actions';


export const updateEventSucceededEpic = (action$: EpicAction<any>) =>
    action$.pipe(ofType(editActionTypes.EVENT_SCHEDULE_SUCCESS), map((action: any) => {
        const { eventId } = action.meta;
        return commitEnrollmentEvent(eventId);
    }));

export const updateEventFailedEpic = (action$: EpicAction<any>) =>
    action$.pipe(
        ofType(
            editActionTypes.EVENT_SCHEDULE_ERROR,
        ),
        map((action: any) => {
            const { eventId } = action.meta;
            return batchActions([saveFailed(), rollbackEnrollmentEvent(eventId)]);
        }),
    );
