// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentPageActionTypes = {
    BASED_ON_ENROLLMENT_ID_SELECTIONS_FROM_URL_UPDATE: 'UpdateSelectionsBasedOnTheEnrollmentIdFromUrl',
    ENROLLMENT_PAGE_INITIAL_VIEW_DISPLAY: 'DisplayInitialViewOnEnrollmentPage',
    ENROLLMENT_PAGE_LOADING_VIEW_DISPLAY: 'DisplayErrorViewOnEnrollmentPage',
    ENROLLMENT_PAGE_ERROR_VIEW_DISPLAY: 'DisplayErrorViewOnEnrollmentPage',
};

export const fetchEnrollmentPageInformationFromUrl = (data: Object) => actionCreator(enrollmentPageActionTypes.BASED_ON_ENROLLMENT_ID_SELECTIONS_FROM_URL_UPDATE)(data);

export const showInitialViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INITIAL_VIEW_DISPLAY)();

export const showLoadingViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_LOADING_VIEW_DISPLAY)();

export const showErrorViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_ERROR_VIEW_DISPLAY)();

