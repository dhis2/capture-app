// @flow
import { actionCreator } from '../../../actions/actions.utils';
import type { EnrollmentData } from '../Enrollment/EnrollmentPageDefault/types/common.types';

export const enrollmentActionTypes = {
    SET_ENROLLMENT: 'Enrollment.SetEnrollment',
};

export const setEnrollment = (enrollmentSite: EnrollmentData) =>
    actionCreator(enrollmentActionTypes.SET_ENROLLMENT)({ enrollmentSite });
