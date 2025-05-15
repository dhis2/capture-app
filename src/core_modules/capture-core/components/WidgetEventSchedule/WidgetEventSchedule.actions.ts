import { actionCreator } from '../../actions/actions.utils';
import { effectMethods } from '../../trackerOffline';

export type ApiAssignedUser = {
    id: string;
    username: string;
    firstName: string;
    surname: string;
};

export const scheduleEventWidgetActionTypes = {
    EVENT_SCHEDULE_REQUEST: 'ScheduleEvent.RequestScheduleEvent',
    EVENT_SCHEDULE: 'ScheduleEvent.ScheduleEvent',
    EVENT_UPDATE_SCHEDULED_DATE: 'ScheduleEvent.UpdateScheduledDate',
};

type RequestScheduleEventParams = {
    scheduleDate: string;
    notes: Array<{value: string}>;
    programId: string;
    orgUnitId: string;
    stageId: string;
    teiId: string;
    eventId: string;
    enrollmentId: string;
    categoryOptions: Record<string, string>;
    onSaveExternal: (eventServerValues: Object, uid: string) => void;
    onSaveSuccessActionType?: string;
    onSaveErrorActionType?: string;
    assignedUser?: ApiAssignedUser | null;
};

export const requestScheduleEvent = ({
    scheduleDate,
    notes,
    programId,
    orgUnitId,
    stageId,
    teiId,
    enrollmentId,
    eventId,
    categoryOptions,
    onSaveExternal,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    assignedUser,
}: RequestScheduleEventParams) =>
    actionCreator(scheduleEventWidgetActionTypes.EVENT_SCHEDULE_REQUEST)({
        scheduleDate,
        notes,
        programId,
        orgUnitId,
        stageId,
        teiId,
        enrollmentId,
        eventId,
        categoryOptions,
        onSaveExternal,
        onSaveSuccessActionType,
        onSaveErrorActionType,
        assignedUser,
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
                url: 'tracker?async=false',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: onSaveSuccessActionType && { type: onSaveSuccessActionType, meta: { serverData, uid } },
            rollback: onSaveErrorActionType && { type: onSaveErrorActionType, meta: { serverData, uid } },
        },
    });

export const updateScheduledDateForEvent = (
    serverData: Object,
    eventId: string,
    onSaveSuccessActionType?: string,
    onSaveErrorActionType?: string,
) => actionCreator(scheduleEventWidgetActionTypes.EVENT_UPDATE_SCHEDULED_DATE)({}, {
    offline: {
        effect: {
            url: 'tracker?async=false&importStrategy=UPDATE',
            method: effectMethods.POST,
            data: serverData,
        },
        commit: onSaveSuccessActionType && { type: onSaveSuccessActionType, meta: { eventId, serverData } },
        rollback: onSaveErrorActionType && { type: onSaveErrorActionType, meta: { eventId, serverData } },
    },
});
