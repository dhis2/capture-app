// @flow
import { actionCreator } from '../../actions/actions.utils';
import { effectMethods } from '../../trackerOffline';

export const scheduleEventWidgetActionTypes = {
    EVENT_SCHEDULE_REQUEST: 'ScheduleEvent.RequestScheduleEvent',
    EVENT_SCHEDULE: 'ScheduleEvent.ScheduleEvent',
};

export const requestScheduleEvent = ({
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
}: {
    scheduleDate: string,
    comments: Array<{value: string}>,
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
        comments,
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
