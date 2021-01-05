// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentPageActionTypes = {
    ENROLLMENT_PAGE_INITIAL_VIEW_DISPLAY: 'DisplayInitialViewOnEnrollmentPage',
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_START: 'StartFetchingEnrollmentPageInformationBasedOnIdFromUrl',
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_LOADING: 'LoadingOnFetchingEnrollmentPageInformationBasedOnIdFromUrl',
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_ERROR: 'ErrorOnFetchingEnrollmentPageInformationBasedOnIdFromUrl',
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_SUCCESS: 'SuccessfulFetchingFetchEnrollmentPageInformationBasedOnIdFromUrl',
    TRACKED_ENTITY_INSTANCE_SELECTION_CLEAR: 'ClearTrackedEntityInstanceSelection',
    ENROLLMENT_SELECTION_SET: 'SetEnrollmentSelection',

    UPDATE_CONTEXT: 'UpdateBothUrlAndCurrentSelectionsWithInformationDerivedFromEnrollmentId',
};

export const showInitialViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INITIAL_VIEW_DISPLAY)();

export const startFetchingEnrollmentPageInformationFromUrl = (data: Object) =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_START)(data);

export const showLoadingViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_LOADING)();

export const showErrorViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INITIAL_VIEW_DISPLAY)();

export const successfulFetchingEnrollmentPageInformationFromUrl = ({ selectedName, enrollmentsSortedByDate }: Object) =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_SUCCESS)(
        { selectedName, enrollmentsSortedByDate },
    );

export const clearTrackedEntityInstanceSelection = () =>
    actionCreator(enrollmentPageActionTypes.TRACKED_ENTITY_INSTANCE_SELECTION_CLEAR)();

export const setEnrollmentSelection = ({ enrollmentId }: Object) =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_SELECTION_SET)({ enrollmentId });


export const pushCompleteUrl = ({ programId, orgUnitId, trackedEntityInstanceId, enrollmentId }: Object) =>
    actionCreator(enrollmentPageActionTypes.UPDATE_CONTEXT)({ programId, orgUnitId, trackedEntityInstanceId, enrollmentId });
