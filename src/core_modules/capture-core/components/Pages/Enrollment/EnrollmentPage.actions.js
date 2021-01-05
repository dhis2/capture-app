// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const enrollmentPageActionTypes = {
    // todo not used
    ENROLLMENT_PAGE_INITIAL_VIEW_DISPLAY: 'DisplayInitialViewOnEnrollmentPage',
    ENROLLMENT_PAGE_INFORMATION_FETCH: 'StartFetchingEnrollmentPageInformation',
    ENROLLMENT_PAGE_INFORMATION_LOADING_FETCH: 'LoadingOnFetchingEnrollmentPageInformation',
    ENROLLMENT_PAGE_INFORMATION_ERROR_FETCH: 'ErrorOnFetchingEnrollmentPageInformation',
    ENROLLMENT_PAGE_INFORMATION_SUCCESS_FETCH: 'SuccessOnFetchingEnrollmentPageInformation',

    TRACKED_ENTITY_INSTANCE_SELECTION_CLEAR: 'TrackedEntityInstanceSelectionClear',
    ENROLLMENT_SELECTION_SET: 'EnrollmentSelectionSet',

    OPEN_ENROLLMENT_PAGE: 'OpenEnrollmentPage',
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

// todo move to locked selector
export const clearTrackedEntityInstanceSelection = () =>
    actionCreator(enrollmentPageActionTypes.TRACKED_ENTITY_INSTANCE_SELECTION_CLEAR)();

export const setEnrollmentSelection = ({ enrollmentId }: Object) =>
    actionCreator(enrollmentPageActionTypes.ENROLLMENT_SELECTION_SET)({ enrollmentId });

export const openEnrollmentPage = ({ programId, orgUnitId, teiId, enrollmentId }: Object) =>
    actionCreator(enrollmentPageActionTypes.OPEN_ENROLLMENT_PAGE)({ programId, orgUnitId, teiId, enrollmentId });
