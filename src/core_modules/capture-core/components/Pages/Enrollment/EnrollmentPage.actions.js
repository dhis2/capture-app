// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentPageActionTypes = {
    // todo not used
    ENROLLMENT_PAGE_INITIAL_VIEW_DISPLAY: 'DisplayInitialViewOnEnrollmentPage',
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_START: 'StartFetchingEnrollmentPageInformationBasedOnIdFromUrl',
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_LOADING: 'LoadingOnFetchingEnrollmentPageInformationBasedOnIdFromUrl',
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_ERROR: 'ErrorOnFetchingEnrollmentPageInformationBasedOnIdFromUrl',
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_SUCCESS: 'SuccessfulFetchingFetchEnrollmentPageInformationBasedOnIdFromUrl',
    TRACKED_ENTITY_INSTANCE_SELECTION_CLEAR: 'TrackedEntityInstanceSelectionClear',
    ENROLLMENT_SELECTION_SET: 'EnrollmentSelectionSet',
    ENROLLMENT_SELECTION_CLEAR: 'EnrollmentSelectionClear',

    CURRENT_SELECTIONS_UPDATE: 'UpdateBothUrlAndCurrentSelectionsWithInformationDerivedFromEnrollmentId',
};

export const startFetchingEnrollmentPageInformation = (data: Object) =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_START)(data);

export const showLoadingViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_LOADING)();

export const showErrorViewOnEnrollmentPage = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_ERROR)();

export const successfulFetchingEnrollmentPageInformationFromUrl = ({ selectedName, enrollmentsSortedByDate }: Object) =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_SUCCESS)(
        { selectedName, enrollmentsSortedByDate },
    );

// todo move to locked selector
export const clearTrackedEntityInstanceSelection = () =>
    actionCreator(enrollmentPageActionTypes.TRACKED_ENTITY_INSTANCE_SELECTION_CLEAR)();

export const setEnrollmentSelection = ({ enrollmentId }: Object) =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_SELECTION_SET)({ enrollmentId });

export const clearEnrollmentSelection = () =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_SELECTION_CLEAR)();

export const pushCompleteUrl = ({ programId, orgUnitId, trackedEntityInstanceId, enrollmentId }: Object) =>
    actionCreator(enrollmentPageActionTypes.CURRENT_SELECTIONS_UPDATE)({ programId, orgUnitId, trackedEntityInstanceId, enrollmentId });
