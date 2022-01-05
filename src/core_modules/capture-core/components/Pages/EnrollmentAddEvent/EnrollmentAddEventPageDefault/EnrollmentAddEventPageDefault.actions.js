// @flow
import { push } from 'connected-react-router';

export const addEnrollmentEventPageDefaultActionTypes = {
    EVENT_SAVE_SUCCESS: 'NewEnrollmentEventPage.saveEventSuccess',
    EVENT_SAVE_ERROR: 'NewEnrollmentEventPage.saveEventError',
    EVENT_SCHEDULE_SUCCESS: 'ScheduleEvent.ScheduleEventSuccess',
    EVENT_SCHEDULE_ERROR: 'ScheduleEvent.ScheduleEventError',
};

export const navigateToEnrollmentPage = (programId: string, orgUnitId: string, teiId: string, enrollmentId?: string) =>
    push(`/enrollment?programId=${programId}&orgUnitId=${orgUnitId}&teiId=${teiId}${
        enrollmentId ? `&enrollmentId=${enrollmentId}` : ''}`);

