// @flow
import { actionCreator } from '../../../../actions/actions.utils';
// import type { EnrollmentData } from '../../Enrollment/EnrollmentPageDefault/types/common.types';

export const enrollmentSiteActionTypes = {
    COMMON_ENROLLMENT_SITE_DATA_SET: 'EnrollmentSite.SetCommonData',
    UPDATE_ENROLLMENT_EVENTS: 'Enrollment.UpdateEnrollmentEvents',
    ROLLBACK_ENROLLMENT_EVENT: 'Enrollment.RollbackEnrollmentEvent',
    COMMIT_ENROLLMENT_EVENT: 'Enrollment.CommitEnrollmentEvent',
};

export const setCommonEnrollmentSiteData = (enrollment: ApiEnrollment, attributeValues: ApiAttributeValues) =>
    actionCreator(enrollmentSiteActionTypes.COMMON_ENROLLMENT_SITE_DATA_SET)({ enrollment, attributeValues });

export const updateEnrollmentEvents = (eventId: string, eventData: Object) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_EVENTS)({
        eventId,
        eventData,
    });

export const rollbackEnrollmentEvent = (eventId: string) =>
    actionCreator(enrollmentSiteActionTypes.ROLLBACK_ENROLLMENT_EVENT)({
        eventId,
    });

export const commitEnrollmentEvent = (eventId: string) =>
    actionCreator(enrollmentSiteActionTypes.COMMIT_ENROLLMENT_EVENT)({
        eventId,
    });
