// @flow
import { actionCreator } from '../../actions/actions.utils';
import { effectMethods } from '../../trackerOffline';

export const scheduleEventWidgetActionTypes = {
    START_EVENT_SCHEDULE: 'ScheduleEvent.StartEditingScheduleEvent',
    EVENT_SCHEDULE_REQUEST: 'ScheduleEvent.RequestScheduleEvent',
    EVENT_SCHEDULE: 'ScheduleEvent.ScheduleEvent',
    EVENT_NOTE_ADD: 'ScheduleEvent.AddEventNote',
};

export const requestScheduleEvent = ({
    scheduleDate,
    programId,
    orgUnitId,
    stageId,
    teiId,
    enrollmentId,
    onSaveExternal,
    onSaveSuccessActionType,
    onSaveErrorActionType,
}: {
    scheduleDate: string,
    programId: string,
    orgUnitId: string,
    stageId: string,
    teiId: string,
    enrollmentId: string,
    onSaveExternal: (eventServerValues: Object, uid: string) => void,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
}) =>
    actionCreator(scheduleEventWidgetActionTypes.EVENT_SCHEDULE_REQUEST)({
        scheduleDate,
        programId,
        orgUnitId,
        stageId,
        teiId,
        enrollmentId,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
    });

export const scheduleEvent = (
    serverData: Object,
    uid: string,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
) =>
    actionCreator(scheduleEventWidgetActionTypes.EVENT_SCHEDULE)({}, {
        offline: {
            effect: {
                url: 'events',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: { type: onSaveSuccessActionType, meta: { serverData, uid } },
            rollback: { type: onSaveErrorActionType, meta: { serverData, uid } },
        },
    });

export const addScheduleEventNote = (comment: string) =>
    actionCreator(scheduleEventWidgetActionTypes.EVENT_NOTE_ADD)({ note: { value: comment } });

export const startEditingScheduleEvent = () => actionCreator(scheduleEventWidgetActionTypes.START_EVENT_SCHEDULE)();
