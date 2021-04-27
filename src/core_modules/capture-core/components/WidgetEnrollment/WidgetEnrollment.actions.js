// @flow
import { actionCreator } from '../../actions/actions.utils';

export const widgetEnrollmentActionTypes = {
    ENROLLMENT_FETCH: 'WidgetEnrollment.Fetch',
    ENROLLMENT_SUCCESS_FETCH: 'WidgetEnrollment.SuccessFetch',
};

export const fetchEnrollment = () =>
    actionCreator(widgetEnrollmentActionTypes.ENROLLMENT_FETCH)();

export const successFetchEnrollment = ({ enrollments }: Object) =>
    actionCreator(widgetEnrollmentActionTypes.ENROLLMENT_SUCCESS_FETCH)({ enrollments });

