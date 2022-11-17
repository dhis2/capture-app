// @flow
import { ofType } from 'redux-observable';
import { v4 as uuid } from 'uuid';
import { map } from 'rxjs/operators';
import {
    scheduleEventWidgetActionTypes,
    scheduleEvent,
    updateScheduledDateForEvent,
} from './WidgetEventSchedule.actions';
import { statusTypes } from '../../events/statusTypes';

export const scheduleEnrollmentEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(scheduleEventWidgetActionTypes.EVENT_SCHEDULE_REQUEST),
        map((action) => {
            const uid = uuid();
            const {
                scheduleDate,
                comments,
                programId,
                orgUnitId,
                stageId,
                teiId,
                enrollmentId,
                eventId,
                onSaveExternal,
                onSaveSuccessActionType,
                onSaveErrorActionType,
            } = action.payload;

            const { events } = store.value;
            const existingEnrollment = events[eventId]
            && [statusTypes.SCHEDULE, statusTypes.OVERDUE].includes(events[eventId].status);

            const serverData = { events: [{
                scheduledAt: scheduleDate,
                dataValues: [],
                trackedEntity: teiId,
                event: eventId,
                orgUnit: orgUnitId,
                enrollment: enrollmentId,
                program: programId,
                programStage: stageId,
                status: 'SCHEDULE',
                notes: comments ?? [],
            }] };

            if (existingEnrollment) {
                onSaveExternal && onSaveExternal(serverData.events[0]);
                return updateScheduledDateForEvent(serverData, eventId, onSaveSuccessActionType, onSaveErrorActionType);
            }

            onSaveExternal && onSaveExternal(serverData, uid);
            return scheduleEvent(serverData, uid, onSaveSuccessActionType, onSaveErrorActionType);
        }),
    );

