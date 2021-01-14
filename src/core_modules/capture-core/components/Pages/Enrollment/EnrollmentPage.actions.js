// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentPageActionTypes = {
    INFORMATION_FETCH: 'EnrollmentPage.Fetch',
    INFORMATION_USING_TEI_ID_FETCH: 'EnrollmentPage.StartFetchingUsingTeiId',
    INFORMATION_USING_ENROLLMENT_ID_FETCH: 'EnrollmentPage.StartFetchingUsingEnrollmentId',
    INFORMATION_LOADING_FETCH: 'EnrollmentPage.LoadingOnFetching',
    INFORMATION_ERROR_FETCH: 'EnrollmentPage.ErrorOnFetching',
    INFORMATION_SUCCESS_FETCH: 'EnrollmentPage.SuccessOnFetching',

    PAGE_OPEN: 'EnrollmentPage.Open',
    PAGE_CLEAN: 'EnrollmentPage.CleanOnUnmount',
    CUSTOM_PROGRAM_RESET: 'EnrollmentPage.CustomProgramReset',

    DEFAULT_VIEW: 'EnrollmentPage.DefaultView',
    ZERO_ENROLLMENTS_VIEW: 'EnrollmentPage.ZeroEnrollmentsView',
    EVENT_PROGRAM_SELECTED_VIEW: 'EnrollmentPage.EventProgramSelectedView',
    MISSING_PROGRAM_CATEGORIES_VIEW: 'EnrollmentPage.MissingProgramCategoriesView',
    MISSING_PROGRAM_VIEW: 'EnrollmentPage.MissingProgramIdView',
    MISSING_ENROLLMENT_VIEW: 'EnrollmentPage.MissingEnrollmentIdView',
};

export const fetchEnrollmentPageInformation = () =>
    actionCreator(enrollmentPageActionTypes.INFORMATION_FETCH)();

export const startFetchingTeiFromTeiId = () =>
    actionCreator(enrollmentPageActionTypes.INFORMATION_USING_TEI_ID_FETCH)();

export const startFetchingTeiFromEnrollmentId = () =>
    actionCreator(enrollmentPageActionTypes.INFORMATION_USING_ENROLLMENT_ID_FETCH)();

export const showLoadingViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.INFORMATION_LOADING_FETCH)();

export const showMissingCategoryMessageOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.MISSING_PROGRAM_CATEGORIES_VIEW)();

export const showDefaultViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.DEFAULT_VIEW)();

export const showZeroEnrollmentsMessageOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ZERO_ENROLLMENTS_VIEW)();

export const showEventProgramMessageOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.EVENT_PROGRAM_SELECTED_VIEW)();

export const showMissingProgramMessageOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.MISSING_PROGRAM_VIEW)();

export const showMissingEnrollmentMessageOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.MISSING_ENROLLMENT_VIEW)();

export const showErrorViewOnEnrollmentPage = ({ error }: { error: string }) =>
    actionCreator(enrollmentPageActionTypes.INFORMATION_ERROR_FETCH)({ error });

export const successfulFetchingEnrollmentPageInformationFromUrl = ({ selectedName, enrollmentsSortedByDate }: Object) =>
    actionCreator(enrollmentPageActionTypes.INFORMATION_SUCCESS_FETCH)(
        { selectedName, enrollmentsSortedByDate });

export const openEnrollmentPage = ({ programId, orgUnitId, teiId, enrollmentId }: Object) =>
    actionCreator(enrollmentPageActionTypes.PAGE_OPEN)({ programId, orgUnitId, teiId, enrollmentId });

export const cleanEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.PAGE_CLEAN)();

export const resetProgramOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.CUSTOM_PROGRAM_RESET)();
