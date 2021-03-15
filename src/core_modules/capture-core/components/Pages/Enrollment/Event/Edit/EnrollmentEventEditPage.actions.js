// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const enrollmentEventEditPagePageActionTypes = {
    EVENT_START_FETCH: 'EnrollmentEventEditPage.FetchingEvent',
    EVENT_ERROR_FETCH: 'EnrollmentEventEditPage.ErrorOnFetching',
    EVENT_SUCCESS_FETCH: 'EnrollmentEventEditPage.SuccessOnFetching',
    EVENT_LOADING_FETCH: 'EnrollmentEventEditPage.LoadingOnFetching',

    TEI_RESET: 'EnrollmentEventEditPage.ResetTei',
    ENROLLMENT_RESET: 'EnrollmentEventEditPage.ResetEnrollment',
    STAGE_RESET: 'EnrollmentEventEditPage.ResetStage',
    EVENT_RESET: 'EnrollmentEventEditPage.ResetEvent',

    PAGE_OPEN: 'EnrollmentPage.Open',
    PAGE_CLEAN: 'EnrollmentPage.CleanOnUnmount',
    CUSTOM_PROGRAM_RESET: 'EnrollmentPage.CustomProgramReset',

    DEFAULT_VIEW: 'EnrollmentPage.DefaultView',
    MISSING_MESSAGE_VIEW: 'EnrollmentPage.MissingMessageView',
};

export const showLoadingViewOnEnrollmentEventEditPage = () =>
    actionCreator(enrollmentEventEditPagePageActionTypes.EVENT_LOADING_FETCH)();

export const showErrorViewOnEnrollmentEventEditPage = ({ error }: { error: string }) =>
    actionCreator(enrollmentEventEditPagePageActionTypes.EVENT_ERROR_FETCH)({ error });

export const fetchEventInformation = () =>
    actionCreator(enrollmentEventEditPagePageActionTypes.EVENT_START_FETCH)();

export const successfulFetchingEventInformation = ({ ...args }: any) =>
    actionCreator(enrollmentEventEditPagePageActionTypes.EVENT_SUCCESS_FETCH)({ ...args });
