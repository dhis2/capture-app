// @flow
import { actionCreator } from '../../../actions/actions.utils';
import type { Url } from '../../../utils/url';

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
    MISSING_MESSAGE_VIEW: 'EnrollmentPage.MissingMessageView',

    DELETE_ENROLLMENT: 'EnrollmentPage.DeleteEnrollment',
    UPDATE_TEI_DISPLAY_NAME: 'EnrollmentPage.UpdateTeiDisplayName',

    SET_EVENT_RELATIONSHIPS_DATA: 'EnrollmentPage.SetEventRelationshipsData',
    LINKED_RECORD_CLICK: 'EnrollmentPage.LinkedRecordClick',
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

export const successfulFetchingEnrollmentPageInformationFromUrl = ({ teiDisplayName, tetId, enrollmentsSortedByDate }: Object) =>
    actionCreator(enrollmentPageActionTypes.INFORMATION_SUCCESS_FETCH)(
        { teiDisplayName, tetId, enrollmentsSortedByDate });

export const openEnrollmentPage = ({ programId, orgUnitId, teiId, enrollmentId }: Object) =>
    actionCreator(enrollmentPageActionTypes.PAGE_OPEN)({ programId, orgUnitId, teiId, enrollmentId });

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

export const setEventRelationshipsData = (eventId: string, relationships: Array<Object>) =>
    actionCreator(enrollmentPageActionTypes.SET_EVENT_RELATIONSHIPS_DATA)({ eventId, relationships });

export const clickLinkedRecord = (parameters: Url) =>
    actionCreator(enrollmentPageActionTypes.LINKED_RECORD_CLICK)({ ...parameters });
