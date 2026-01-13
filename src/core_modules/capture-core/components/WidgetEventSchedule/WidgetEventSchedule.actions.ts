import type { ApiAssignedUser } from 'capture-core-utils/types/api-types';
import { actionCreator } from '../../actions/actions.utils';
import { effectMethods } from '../../trackerOffline';

export const scheduleEventWidgetActionTypes = {
    EVENT_SCHEDULE_REQUEST: 'ScheduleEvent.RequestScheduleEvent',
    EVENT_SCHEDULE: 'ScheduleEvent.ScheduleEvent',
    EVENT_UPDATE_SCHEDULED_DATE: 'ScheduleEvent.UpdateScheduledDate',
};

export const requestScheduleEvent = ({
    scheduleDate,
    notes,
    programId,
    orgUnitId,
    stageId,
    teiId,
    eventId,
    enrollmentId,
    categoryOptions,
    onSaveExternal,
    onSaveSuccessActionType,
    onSaveErrorActionType,
    assignedUser,
}: {
    scheduleDate: string;
    notes: Array<{
        value: string;
        storedAt?: string;
        storedBy?: string;
        createdBy?: any;
        note?: string;
    }>;
    programId: string;
    orgUnitId: string;
    stageId: string;
    teiId: string;
    eventId: string;
    enrollmentId: string;
    categoryOptions: any;
    onSaveExternal: (eventServerValues: any, uid: string) => void;
    onSaveSuccessActionType?: string;
    onSaveErrorActionType?: string;
    assignedUser?: ApiAssignedUser;
}) =>
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
    serverData: any,
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
    serverData: any,
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
