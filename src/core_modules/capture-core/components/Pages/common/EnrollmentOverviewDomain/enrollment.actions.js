// @flow
import { actionCreator } from '../../../../actions/actions.utils';
import type { EventReducerProps } from '../../../WidgetEnrollment/enrollment.types';
// import type { EnrollmentData } from '../../Enrollment/EnrollmentPageDefault/types/common.types';

export const enrollmentSiteActionTypes = {
    COMMON_ENROLLMENT_SITE_DATA_SET: 'EnrollmentSite.SetCommonData',
    UPDATE_ENROLLMENT_EVENTS: 'Enrollment.UpdateEnrollmentEvents',
    UPDATE_ENROLLMENT_EVENTS_WITHOUT_ID: 'Enrollment.UpdateEnrollmentEventsWithoutId',
    UPDATE_ENROLLMENT_ATTRIBUTE_VALUES: 'Enrollment.UpdateEnrollmentAttributeValues',
    ROLLBACK_ENROLLMENT_EVENT: 'Enrollment.RollbackEnrollmentEvent',
    ROLLBACK_ENROLLMENT_EVENT_WITHOUT_ID: 'Enrollment.RollbackEnrollmentEventWithoutId',
    COMMIT_ENROLLMENT_EVENT: 'Enrollment.CommitEnrollmentEvent',
    COMMIT_ENROLLMENT_EVENT_WITHOUT_ID: 'Enrollment.CommitEnrollmentEventWithoutId',
    SAVE_FAILED: 'Enrollment.SaveFailed',
    ERROR_ENROLLMENT: 'Enrollment.ErrorEnrollment',
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

export const updateEnrollmentEventsWithoutId = ({ events }: EventReducerProps) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_EVENTS_WITHOUT_ID)({ events });

export const rollbackEnrollmentEventWithoutId = ({ events }: EventReducerProps) =>
    actionCreator(enrollmentSiteActionTypes.ROLLBACK_ENROLLMENT_EVENT_WITHOUT_ID)({ events });

export const commitEnrollmentEventWithoutId = ({ events }: EventReducerProps) =>
    actionCreator(enrollmentSiteActionTypes.COMMIT_ENROLLMENT_EVENT_WITHOUT_ID)({ events });

export const saveFailed = () => actionCreator(enrollmentSiteActionTypes.SAVE_FAILED)();

export const updateEnrollmentAttributeValues = (attributeValues: Array<{ [key: string]: string }>) =>
    actionCreator(enrollmentSiteActionTypes.UPDATE_ENROLLMENT_ATTRIBUTE_VALUES)({
        attributeValues,
    });

export const showEnrollmentError = ({ message }: { message: string }) =>
    actionCreator(enrollmentSiteActionTypes.ERROR_ENROLLMENT)({
        message,
    });
