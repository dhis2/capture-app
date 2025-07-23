import { actionCreator } from '../../../../actions/actions.utils';
import type { ApiEnrollment } from '../../../../../capture-core-utils/types/api-types';
import type { AttributeValue } from './useCommonEnrollmentDomainData/useCommonEnrollmentDomainData.types';

export const enrollmentSiteActionTypes = {
    COMMON_ENROLLMENT_SITE_DATA_SET: 'EnrollmentSite.SetCommonData',
    UPDATE_ENROLLMENT_DATE: 'Enrollment.UpdateEnrollmentDate',
    UPDATE_INCIDENT_DATE: 'Enrollment.UpdateIncidentDate',
    UPDATE_ENROLLMENT_EVENT: 'Enrollment.UpdateEnrollmentEvent',
    UPDATE_OR_ADD_ENROLLMENT_EVENTS: 'Enrollment.UpdateOrAddEnrollmentEvents',
    UPDATE_ENROLLMENT_EVENT_WITHOUT_ID: 'Enrollment.UpdateEnrollmentEventWithoutId',
    UPDATE_ENROLLMENT_ATTRIBUTE_VALUES: 'Enrollment.UpdateEnrollmentAttributeValues',
    ROLLBACK_ENROLLMENT_EVENT: 'Enrollment.RollbackEnrollmentEvent',
    ROLLBACK_ENROLLMENT_EVENTS: 'Enrollment.RollbackEnrollmentEvents',
    DELETE_ENROLLMENT_EVENT: 'Enrollment.DeleteEnrollmentEvent',
    DELETE_ENROLLMENT_EVENT_RELATIONSHIP: 'Enrollment.DeleteEnrollmentEventRelationship',
    UPDATE_ENROLLMENT_EVENT_STATUS: 'Enrollment.UpdateEnrollmentEventStatus',
    COMMIT_ENROLLMENT_EVENT: 'Enrollment.CommitEnrollmentEvent',
    COMMIT_ENROLLMENT_EVENTS: 'Enrollment.CommitEnrollmentEvents',
    SAVE_FAILED: 'Enrollment.SaveFailed',
    ERROR_ENROLLMENT: 'Enrollment.ErrorEnrollment',
    ADD_PERSISTED_ENROLLMENT_EVENTS: 'Enrollment.AddPersistedEnrollmentEvents',
    UPDATE_ENROLLMENT_AND_EVENTS: 'Enrollment.UpdateEnrollmentAndEvents',
    ROLLBACK_ENROLLMENT_AND_EVENTS: 'Enrollment.RollbackEnrollmentAndEvents',
    COMMIT_ENROLLMENT_AND_EVENTS: 'Enrollment.CommitEnrollmentAndEvents',
    SET_EXTERNAL_ENROLLMENT_STATUS: 'Enrollment.SetExternalEnrollmentStatus',
};

export const setCommonEnrollmentSiteData = (enrollment: ApiEnrollment, attributeValues: Array<AttributeValue>) =>
    actionCreator(enrollmentSiteActionTypes.COMMON_ENROLLMENT_SITE_DATA_SET)({ enrollment, attributeValues });

export const updateEnrollmentDate = (enrollmentDate: string) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_DATE)({
        enrollmentDate,
    });

export const updateIncidentDate = (incidentDate: string) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_INCIDENT_DATE)({
        incidentDate,
    });

export const updateEnrollmentEvent = (eventId: string, eventData: any) =>
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

export const updateOrAddEnrollmentEvents = ({ events }: { events: Array<Record<string, unknown>> }) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_OR_ADD_ENROLLMENT_EVENTS)({ events });

export const deleteEnrollmentEvent = (eventId: string) =>
    actionCreator(enrollmentSiteActionTypes.DELETE_ENROLLMENT_EVENT)({ eventId });

export const deleteEnrollmentEventRelationship = (relationshipId: string) =>
    actionCreator(enrollmentSiteActionTypes.DELETE_ENROLLMENT_EVENT_RELATIONSHIP)({ relationshipId });

export const updateEnrollmentEventStatus = (eventId: string, status: string, updatedAt: string) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_EVENT_STATUS)({
        eventId,
        status,
        updatedAt,
    });

export const rollbackEnrollmentEvents = ({ events }: { events: Array<Record<string, unknown>> }) =>
    actionCreator(enrollmentSiteActionTypes.ROLLBACK_ENROLLMENT_EVENTS)({ events });

export const commitEnrollmentEvents = ({ events }: { events: Array<Record<string, unknown>> }) =>
    actionCreator(enrollmentSiteActionTypes.COMMIT_ENROLLMENT_EVENTS)({ events });

export const updateEnrollmentEventWithoutId = (uid: string, eventData: any) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_EVENT_WITHOUT_ID)({
        eventData,
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

export const updateEnrollmentAndEvents = (enrollment: any) =>
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

export const addPersistedEnrollmentEvents = ({ events }: { events: Array<Record<string, unknown>> }) =>
    actionCreator(enrollmentSiteActionTypes.ADD_PERSISTED_ENROLLMENT_EVENTS)({ events });
