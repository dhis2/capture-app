// @flow
import { actionCreator } from '../../../../actions/actions.utils';

export const enrollmentSiteActionTypes = {
    COMMON_ENROLLMENT_SITE_DATA_SET: 'EnrollmentSite.SetCommonData',
    UPDATE_ENROLLMENT_DATE: 'Enrollment.UpdateEnrollmentDate',
    UPDATE_INCIDENT_DATE: 'Enrollment.UpdateIncidentDate',
    UPDATE_ENROLLMENT_EVENT: 'Enrollment.UpdateEnrollmentEvent',
    UPDATE_ENROLLMENT_EVENT_WITHOUT_ID: 'Enrollment.UpdateEnrollmentEventWithoutId',
    UPDATE_ENROLLMENT_ATTRIBUTE_VALUES: 'Enrollment.UpdateEnrollmentAttributeValues',
    ROLLBACK_ENROLLMENT_EVENT: 'Enrollment.RollbackEnrollmentEvent',
    ROLLBACK_ENROLLMENT_EVENT_WITHOUT_ID: 'Enrollment.RollbackEnrollmentEventWithoutId',
    COMMIT_ENROLLMENT_EVENT: 'Enrollment.CommitEnrollmentEvent',
    COMMIT_ENROLLMENT_EVENT_WITHOUT_ID: 'Enrollment.CommitEnrollmentEventWithoutId',
    SAVE_FAILED: 'Enrollment.SaveFailed',
    ERROR_ENROLLMENT: 'Enrollment.ErrorEnrollment',
    UPDATE_ENROLLMENT_AND_EVENTS: 'Enrollment.UpdateEnrollmentAndEvents',
    ROLLBACK_ENROLLMENT_AND_EVENTS: 'Enrollment.RollbackEnrollmentAndEvents',
    COMMIT_ENROLLMENT_AND_EVENTS: 'Enrollment.CommitEnrollmentAndEvents',
    SET_EXTERNAL_ENROLLMENT_STATUS: 'Enrollment.SetExternalEnrollmentStatus',
};

export const setCommonEnrollmentSiteData = (enrollment: ApiEnrollment, attributeValues: ApiAttributeValues) =>
    actionCreator(enrollmentSiteActionTypes.COMMON_ENROLLMENT_SITE_DATA_SET)({ enrollment, attributeValues });

export const updateEnrollmentDate = (enrollmentDate: string) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_DATE)({
        enrollmentDate,
    });

export const updateIncidentDate = (incidentDate: string) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_INCIDENT_DATE)({
        incidentDate,
    });

export const updateEnrollmentEvent = (eventId: string, eventData: Object) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_EVENT)({
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

export const updateEnrollmentEventWithoutId = (uid: string, eventData: Object) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_EVENT_WITHOUT_ID)({
        eventData,
        uid,
    });

export const rollbackEnrollmentEventWithoutId = (uid: string) =>
    actionCreator(enrollmentSiteActionTypes.ROLLBACK_ENROLLMENT_EVENT_WITHOUT_ID)({
        uid,
    });

export const commitEnrollmentEventWithoutId = (uid: string, eventId: string) =>
    actionCreator(enrollmentSiteActionTypes.COMMIT_ENROLLMENT_EVENT_WITHOUT_ID)({
        eventId,
        uid,
    });
export const saveFailed = () => actionCreator(enrollmentSiteActionTypes.SAVE_FAILED)();

export const updateEnrollmentAttributeValues = (attributeValues: Array<{ [key: string]: string }>) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_ATTRIBUTE_VALUES)({
        attributeValues,
    });

export const showEnrollmentError = ({ message }: { message: string }) =>
    actionCreator(enrollmentSiteActionTypes.ERROR_ENROLLMENT)({
        message,
    });

export const updateEnrollmentAndEvents = (enrollment: ApiEnrollment) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_AND_EVENTS)({
        enrollment,
    });

export const rollbackEnrollmentAndEvents = (uid?: string) =>
    actionCreator(enrollmentSiteActionTypes.ROLLBACK_ENROLLMENT_AND_EVENTS)({
        uid,
    });

export const commitEnrollmentAndEvents = (uid?: string, eventId?: string) =>
    actionCreator(enrollmentSiteActionTypes.COMMIT_ENROLLMENT_AND_EVENTS)({
        uid,
        eventId,
    });

export const setExternalEnrollmentStatus = (status: string) =>
    actionCreator(enrollmentSiteActionTypes.SET_EXTERNAL_ENROLLMENT_STATUS)({
        status,
    });
