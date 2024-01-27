// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentPageActionTypes = {
    INFORMATION_FETCH: 'EnrollmentPage.Fetch',
    INFORMATION_USING_TEI_ID_FETCH: 'EnrollmentPage.StartFetchingUsingTeiId',
    INFORMATION_USING_ENROLLMENT_ID_FETCH: 'EnrollmentPage.StartFetchingUsingEnrollmentId',
    INFORMATION_LOADING_FETCH: 'EnrollmentPage.LoadingOnFetching',
    INFORMATION_ERROR_FETCH: 'EnrollmentPage.ErrorOnFetching',
    INFORMATION_SUCCESS_FETCH: 'EnrollmentPage.SuccessOnFetching',

    PROCESS_ENROLLMENT_ID: 'EnrollmentPage.EnrollmentUrlIdUpdated',
    FETCH_ENROLLMENT_ID: 'EnrollmentPage.FetchEnrollmentId',
    VERIFY_ENROLLMENT_ID_SUCCESS: 'EnrollmentPage.VerifyEnrollmentIdSuccess',
    FETCH_ENROLLMENT_ID_SUCCESS: 'EnrollmentPage.FetchEnrollmentIdSuccess',
    FETCH_ENROLLMENT_ID_ERROR: 'EnrollmentPage.FetchEnrollmentIdError',

    PROCESS_TEI_ID: 'EnrollmentPage.TeiUrlIdUpdated',
    FETCH_TEI: 'EnrollmentPage.FetchTei',
    VERIFY_FETCH_TEI_SUCCESS: 'EnrollmentPage.VerifyFetchTeiSuccess',
    FETCH_TEI_SUCCESS: 'EnrollmentPage.FetchTeiSuccess',
    FETCH_TEI_ERROR: 'EnrollmentPage.FetchTeiError',

    PROCESS_PROGRAM_ID: 'EnrollmentPage.ProgramUrlIdUpdated',
    COMMIT_PROGRAM_ID: 'EnrollmentPage.CommitProgramId',

    FETCH_ENROLLMENTS: 'EnrollmentPage.FetchEnrollments',
    FETCH_ENROLLMENTS_ERROR: 'EnrollmentPage.FetchEnrollmentsError',
    FETCH_ENROLLMENTS_SUCCESS: 'EnrollmentPage.FetchEnrollmentsSuccess',

    PAGE_OPEN: 'EnrollmentPage.Open',
    PAGE_CLEAN: 'EnrollmentPage.CleanOnUnmount',
    CUSTOM_PROGRAM_RESET: 'EnrollmentPage.CustomProgramReset',

    DEFAULT_VIEW: 'EnrollmentPage.DefaultView',
    MISSING_MESSAGE_VIEW: 'EnrollmentPage.MissingMessageView',

    DELETE_ENROLLMENT: 'EnrollmentPage.DeleteEnrollment',
    UPDATE_TEI_DISPLAY_NAME: 'EnrollmentPage.UpdateTeiDisplayName',
    UPDATE_ENROLLMENT_DATE: 'EnrollmentPage.UpdateEnrollmentDate',
};

export const fetchEnrollmentPageInformation = () =>
    actionCreator(enrollmentPageActionTypes.INFORMATION_FETCH)();

export const startFetchingTeiFromTeiId = () =>
    actionCreator(enrollmentPageActionTypes.INFORMATION_USING_TEI_ID_FETCH)();

export const startFetchingTeiFromEnrollmentId = () =>
    actionCreator(enrollmentPageActionTypes.INFORMATION_USING_ENROLLMENT_ID_FETCH)();

export const showLoadingViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.INFORMATION_LOADING_FETCH)();

export const showDefaultViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.DEFAULT_VIEW)();

export const showMissingMessageViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.MISSING_MESSAGE_VIEW)();

export const showErrorViewOnEnrollmentPage = ({ error }: { error: string }) =>
    actionCreator(enrollmentPageActionTypes.INFORMATION_ERROR_FETCH)({ error });

export const successfulFetchingEnrollmentPageInformationFromUrl = ({ teiDisplayName, tetId }: Object) =>
    actionCreator(enrollmentPageActionTypes.INFORMATION_SUCCESS_FETCH)(
        { teiDisplayName, tetId });

type IdSuite = {
    teiId?: ?string,
    programId?: ?string,
};

export const changedEnrollmentId = (enrollmentId: string) =>
    actionCreator(enrollmentPageActionTypes.PROCESS_ENROLLMENT_ID)({ enrollmentId });

export const fetchEnrollmentId = (enrollmentId: string) =>
    actionCreator(enrollmentPageActionTypes.FETCH_ENROLLMENT_ID)({ enrollmentId });

export const verifyEnrollmentIdSuccess = ({ enrollmentId, trackedEntity, program }: Object) =>
    actionCreator(enrollmentPageActionTypes.VERIFY_ENROLLMENT_ID_SUCCESS)({ enrollmentId, teiId: trackedEntity, programId: program });

export const fetchEnrollmentIdSuccess = (payload: IdSuite) =>
    actionCreator(enrollmentPageActionTypes.FETCH_ENROLLMENT_ID_SUCCESS)(payload);

export const fetchEnrollmentIdError = (error: string) =>
    actionCreator(enrollmentPageActionTypes.FETCH_ENROLLMENT_ID_ERROR)({ error });

export const changedTeiId = (payload: IdSuite) =>
    actionCreator(enrollmentPageActionTypes.PROCESS_TEI_ID)(payload);

export const fetchTei = (payload: IdSuite) =>
    actionCreator(enrollmentPageActionTypes.FETCH_TEI)(payload);

export const verifyFetchTeiSuccess = (payload: { ...IdSuite, teiDisplayName: string, tetId: string }) =>
    actionCreator(enrollmentPageActionTypes.VERIFY_FETCH_TEI_SUCCESS)(payload);

export const fetchTeiSuccess = (payload: { ...IdSuite, teiDisplayName: string, tetId: string }) =>
    actionCreator(enrollmentPageActionTypes.FETCH_TEI_SUCCESS)(payload);

export const fetchTeiError = (teiId: string) =>
    actionCreator(enrollmentPageActionTypes.FETCH_TEI_ERROR)(teiId);

export const changedProgramId = (payload: IdSuite) =>
    actionCreator(enrollmentPageActionTypes.PROCESS_PROGRAM_ID)(payload);

export const commitProgramId = (payload: IdSuite) =>
    actionCreator(enrollmentPageActionTypes.COMMIT_PROGRAM_ID)(payload);

export const fetchEnrollments = () =>
    actionCreator(enrollmentPageActionTypes.FETCH_ENROLLMENTS)();

export const fetchEnrollmentsError = ({ accessLevel }: { accessLevel: string }) =>
    actionCreator(enrollmentPageActionTypes.FETCH_ENROLLMENTS_ERROR)({ accessLevel });

export const saveEnrollments = ({ programId, enrollments }: any) =>
    actionCreator(enrollmentPageActionTypes.FETCH_ENROLLMENTS_SUCCESS)({ programId, enrollments });

export const openEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.PAGE_OPEN)();

export const cleanEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.PAGE_CLEAN)();

export const deleteEnrollment = ({ enrollmentId }: { enrollmentId: string }) =>
    actionCreator(enrollmentPageActionTypes.DELETE_ENROLLMENT)({
        enrollmentId,
    });

export const updateTeiDisplayName = (teiDisplayName: string) =>
    actionCreator(enrollmentPageActionTypes.UPDATE_TEI_DISPLAY_NAME)({
        teiDisplayName,
    });

export const updateEnrollmentDate = ({ enrollmentId, enrollmentDate }: { enrollmentId: string, enrollmentDate: string }) =>
    actionCreator(enrollmentPageActionTypes.UPDATE_ENROLLMENT_DATE)({ enrollmentId, enrollmentDate });
