// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentPageActionTypes } from '../../components/Pages/Enrollment/EnrollmentPage.actions';
import { enrollmentPageStatuses } from '../../components/Pages/Enrollment/EnrollmentPage.constants';

const initialReducerValue = {
    enrollmentPageStatus: null,
};
const {
    ENROLLMENT_PAGE_INFORMATION_LOADING_FETCH,
    ENROLLMENT_PAGE_INFORMATION_ERROR_FETCH,
    ENROLLMENT_PAGE_INFORMATION_SUCCESS_FETCH,
    ENROLLMENT_PAGE_CLEAN,
} = enrollmentPageActionTypes;

export const enrollmentPageDesc = createReducerDescription({
    [ENROLLMENT_PAGE_INFORMATION_LOADING_FETCH]: state => ({
        ...state,
        enrollmentPageStatus: enrollmentPageStatuses.LOADING,
    }),
    [ENROLLMENT_PAGE_INFORMATION_ERROR_FETCH]: state => ({
        ...state,
        enrollmentPageStatus: enrollmentPageStatuses.ERROR,
    }),
    [ENROLLMENT_PAGE_INFORMATION_SUCCESS_FETCH]:
      (state, { payload: { enrollmentsSortedByDate, selectedName } }) => ({
          ...state,
          enrollments: enrollmentsSortedByDate,
          enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
          trackedEntityInstanceDisplayName: selectedName,
      }),
    [ENROLLMENT_PAGE_CLEAN]: () => initialReducerValue,
}, 'enrollmentPage', initialReducerValue);
