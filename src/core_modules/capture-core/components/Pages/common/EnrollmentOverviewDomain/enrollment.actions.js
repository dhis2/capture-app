// @flow
import { actionCreator } from '../../../../actions/actions.utils';
import type { EnrollmentData } from '../../Enrollment/EnrollmentPageDefault/types/common.types';

export const enrollmentActionTypes = {
    SET_ENROLLMENT: 'Enrollment.SetEnrollment',
    UPDATE_ENROLLMENT_EVENTS: 'Enrollment.UpdateEnrollmentEvents',
    UPDATE_ENROLLMENT_EVENTS_WITHOUT_ID: 'Enrollment.UpdateEnrollmentEventsWithoutId',
    ROLLBACK_ENROLLMENT_EVENT: 'Enrollment.RollbackEnrollmentEvent',
    ROLLBACK_ENROLLMENT_EVENT_WITHOUT_ID: 'Enrollment.RollbackEnrollmentEventWithoutId',
    COMMIT_ENROLLMENT_EVENT: 'Enrollment.CommitEnrollmentEvent',
    COMMIT_ENROLLMENT_EVENT_WITHOUT_ID: 'Enrollment.CommitEnrollmentEventWithoutId',
    SAVE_FAILED: 'Enrollment.SaveFailed',
};

export const setEnrollment = (enrollmentSite: EnrollmentData) =>
    actionCreator(enrollmentActionTypes.SET_ENROLLMENT)({ enrollmentSite });

export const updateEnrollmentEvents = (eventId: string, eventData: Object) =>
    actionCreator(enrollmentActionTypes.UPDATE_ENROLLMENT_EVENTS)({
        eventId,
        eventData,
    });

export const rollbackEnrollmentEvent = (eventId: string) =>
    actionCreator(enrollmentActionTypes.ROLLBACK_ENROLLMENT_EVENT)({
        eventId,
    });

export const commitEnrollmentEvent = (eventId: string) =>
    actionCreator(enrollmentActionTypes.COMMIT_ENROLLMENT_EVENT)({
        eventId,
    });

export const updateEnrollmentEventsWithoutId = (uid: string, eventData: Object) =>
    actionCreator(enrollmentActionTypes.UPDATE_ENROLLMENT_EVENTS_WITHOUT_ID)({
        eventData,
        uid,
    });

export const rollbackEnrollmentEventWithoutId = (uid: string) =>
    actionCreator(enrollmentActionTypes.ROLLBACK_ENROLLMENT_EVENT_WITHOUT_ID)({
        uid,
    });

export const commitEnrollmentEventWithoutId = (uid: string, eventId: string) =>
    actionCreator(enrollmentActionTypes.COMMIT_ENROLLMENT_EVENT_WITHOUT_ID)({
        eventId,
        uid,
    });
export const saveFailed = () => actionCreator(enrollmentActionTypes.SAVE_FAILED)();
