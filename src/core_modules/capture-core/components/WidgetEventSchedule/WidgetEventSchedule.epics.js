// @flow
import { ofType } from 'redux-observable';
import uuid from 'uuid/v4';
import { map } from 'rxjs/operators';
import { scheduleEventWidgetActionTypes, scheduleEvent, navigateToEnrollmentPage } from './WidgetEventSchedule.actions';


export const scheduleNewEnrollmentEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(scheduleEventWidgetActionTypes.EVENT_SCHEDULE_REQUEST),
        map((action) => {
            const uid = uuid();
            const state = store.value;
            const {
                scheduleDate,
                programId,
                orgUnitId,
                stageId,
                teiId,
                enrollmentId,
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
                notes: state.events?.scheduleEvent?.notes ?? [],
            }] };

            return scheduleEvent(serverData, uid, { orgUnitId, programId, stageId, enrollmentId });
        }),
    );

export const scheduleNewEventSucceededEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(scheduleEventWidgetActionTypes.EVENT_SCHEDULE_SUCCESS),
        map((action) => {
            const { orgUnitId, programId, enrollmentId, stageId } = action.meta.payload;
            return navigateToEnrollmentPage(programId, orgUnitId, stageId, enrollmentId);
        }),
    );

export const scheduleNewEventFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(scheduleEventWidgetActionTypes.EVENT_SCHEDULE_ERROR),
        map((action) => {
            const { orgUnitId, programId, enrollmentId, stageId } = action.meta.payload;
            return navigateToEnrollmentPage(programId, orgUnitId, stageId, enrollmentId);
        }),
    );
