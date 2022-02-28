// @flow
import { ofType } from 'redux-observable';
import uuid from 'uuid/v4';
import { map } from 'rxjs/operators';
import { scheduleEventWidgetActionTypes, scheduleEvent } from './WidgetEventSchedule.actions';


export const scheduleNewEnrollmentEventEpic = (action$: InputObservable) =>
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
                onSaveExternal,
                onSaveSuccessActionType,
                onSaveErrorActionType,
            } = action.payload;


            const serverData = { events: [{
                scheduledAt: scheduleDate,
                dataValues: [],
                trackedEntity: teiId,
                orgUnit: orgUnitId,
                enrollment: enrollmentId,
                program: programId,
                programStage: stageId,
                status: 'SCHEDULE',
                notes: comments ?? [],
            }] };

            onSaveExternal && onSaveExternal(serverData, uid);
            return scheduleEvent(serverData, uid, onSaveSuccessActionType, onSaveErrorActionType);
        }),
    );

