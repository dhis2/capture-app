// @flow
import { actionCreator } from '../../../../actions/actions.utils';
import type { EnrollmentData } from '../../Enrollment/EnrollmentPageDefault/types/common.types';

export const enrollmentActionTypes = {
    SET_ENROLLMENT: 'Enrollment.SetEnrollment',
    UPDATE_ENROLLMENT_EVENTS: 'Enrollment.UpdateEnrollmentEvents',
    ROLLBACK_ENROLLMENT_EVENT: 'Enrollment.RollbackEnrollmentEvent',
    COMMIT_ENROLLMENT_EVENT: 'Enrollment.CommitEnrollmentEvent',
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
