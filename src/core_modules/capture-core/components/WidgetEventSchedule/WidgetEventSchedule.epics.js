// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import uuid from 'uuid/v4';
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
                dueDate: scheduleDate,
                dataValues: [],
                trackedEntityInstance: teiId,
                orgUnit: orgUnitId,
                enrollment: enrollmentId,
                program: programId,
                programStage: stageId,
                status: 'SCHEDULE',
                notes: comments ?? [],
            }] };

            onSaveExternal && onSaveExternal(serverData, uid, onSaveSuccessActionType, onSaveErrorActionType);
            return scheduleEvent(serverData, uid);
        }),
    );

