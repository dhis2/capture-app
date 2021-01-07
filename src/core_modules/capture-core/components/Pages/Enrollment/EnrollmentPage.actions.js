// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentPageActionTypes = {
    ENROLLMENT_PAGE_INITIAL_VIEW_DISPLAY: 'DisplayInitialViewOnEnrollmentPage',
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_START: 'StartFetchingEnrollmentPageInformationBasedOnIdFromUrl',
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_LOADING: 'LoadingOnFetchingEnrollmentPageInformationBasedOnIdFromUrl',
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_ERROR: 'ErrorOnFetchingEnrollmentPageInformationBasedOnIdFromUrl',
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_SUCCESS: 'SuccessfulFetchingFetchEnrollmentPageInformationBasedOnIdFromUrl',
    TRACKED_ENTITY_INSTANCE_SELECTION_CLEAR: 'ClearTrackedEntityInstanceSelection',
};

export const showInitialViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INITIAL_VIEW_DISPLAY)();

export const startFetchingEnrollmentPageInformationFromUrl = (data: Object) =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_START)(data);

export const showLoadingViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_LOADING)();

export const showErrorViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INITIAL_VIEW_DISPLAY)();

export const successfulFetchingEnrollmentPageInformationFromUrl = ({ selectedName }: Object) =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_SUCCESS)({ selectedName });

export const clearTrackedEntityInstanceSelection = () =>
    actionCreator(enrollmentPageActionTypes.TRACKED_ENTITY_INSTANCE_SELECTION_CLEAR)();
