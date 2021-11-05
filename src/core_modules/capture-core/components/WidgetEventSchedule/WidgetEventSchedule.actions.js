// @flow
import { push } from 'connected-react-router';
import { urlArguments } from '../../utils/url';
import { actionCreator } from '../../actions/actions.utils';
import { effectMethods } from '../../trackerOffline';

export const scheduleEventWidgetActionTypes = {
    START_EVENT_SCHEDULE: 'ScheduleEvent.StartEditingScheduleEvent',
    EVENT_SCHEDULE_REQUEST: 'ScheduleEvent.RequestScheduleEvent',
    EVENT_SCHEDULE: 'ScheduleEvent.ScheduleEvent',
    EVENT_SCHEDULE_SUCCESS: 'ScheduleEvent.ScheduleEventSuccess',
    EVENT_SCHEDULE_ERROR: 'ScheduleEvent.ScheduleEventError',
    EVENT_NOTE_ADD: 'ScheduleEvent.AddEventNote',
};

export const requestScheduleEvent = ({
    scheduleDate,
    programId,
    orgUnitId,
    stageId,
    teiId,
    enrollmentId,
}: {
    scheduleDate: string,
    programId: string,
    orgUnitId: string,
    stageId: string,
    teiId: string,
    enrollmentId: string,
}) =>
    actionCreator(scheduleEventWidgetActionTypes.EVENT_SCHEDULE_REQUEST)({
        scheduleDate,
        programId,
        orgUnitId,
        stageId,
        teiId,
        enrollmentId,
    });

export const scheduleEvent = (serverData: Object, uid: string, payload: Object) =>
    actionCreator(scheduleEventWidgetActionTypes.EVENT_SCHEDULE)({}, {
        offline: {
            effect: {
                url: 'events',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: { type: scheduleEventWidgetActionTypes.EVENT_SCHEDULE_SUCCESS, meta: { serverData, uid, payload } },
            rollback: { type: scheduleEventWidgetActionTypes.EVENT_SCHEDULE_ERROR, meta: { serverData, uid, payload } },
        },
    });

export const navigateToEnrollmentPage = (programId: string, orgUnitId: string, stageId: string, enrollmentId?: string) =>
    push(`/enrollment?${urlArguments({ orgUnitId, programId, stageId, enrollmentId })}`);

export const addScheduleEventNote = (comment: string) =>
    actionCreator(scheduleEventWidgetActionTypes.EVENT_NOTE_ADD)({ note: { value: comment } });

export const startEditingScheduleEvent = () => actionCreator(scheduleEventWidgetActionTypes.START_EVENT_SCHEDULE)();
