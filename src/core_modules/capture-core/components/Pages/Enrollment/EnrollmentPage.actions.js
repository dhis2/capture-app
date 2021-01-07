// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentPageActionTypes = {
    ENROLLMENT_PAGE_INFORMATION_FETCH: 'StartFetchingEnrollmentPageInformation',
    ENROLLMENT_PAGE_INFORMATION_LOADING_FETCH: 'LoadingOnFetchingEnrollmentPageInformation',
    ENROLLMENT_PAGE_INFORMATION_ERROR_FETCH: 'ErrorOnFetchingEnrollmentPageInformation',
    ENROLLMENT_PAGE_INFORMATION_SUCCESS_FETCH: 'SuccessOnFetchingEnrollmentPageInformation',
};

export const startFetchingEnrollmentPageInformation = (data: Object) =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_FETCH)(data);

export const showLoadingViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_LOADING_FETCH)();

export const showErrorViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_ERROR_FETCH)();

export const successfulFetchingEnrollmentPageInformationFromUrl = ({ selectedName, enrollmentsSortedByDate }: Object) =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_SUCCESS_FETCH)(
        { selectedName, enrollmentsSortedByDate });
