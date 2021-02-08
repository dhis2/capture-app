// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentPageActionTypes } from '../../components/Pages/Enrollment/EnrollmentPage.actions';
import { enrollmentPageStatuses } from '../../components/Pages/Enrollment/EnrollmentPage.constants';

const initialReducerValue = {
    enrollmentPageStatus: null,
};
const {
    INFORMATION_LOADING_FETCH,
    INFORMATION_ERROR_FETCH,
    INFORMATION_SUCCESS_FETCH,
    PAGE_CLEAN,
    DEFAULT_VIEW,
    ZERO_ENROLLMENTS_VIEW,
    MISSING_ENROLLMENT_VIEW,
    MISSING_PROGRAM_VIEW,
    EVENT_PROGRAM_SELECTED_VIEW,
} = enrollmentPageActionTypes;

export const enrollmentPageDesc = createReducerDescription({
    [INFORMATION_LOADING_FETCH]: state => ({
        ...state,
        enrollmentPageStatus: enrollmentPageStatuses.LOADING,
    }),
    [INFORMATION_ERROR_FETCH]: state => ({
        ...state,
        enrollmentPageStatus: enrollmentPageStatuses.ERROR,
    }),
    [INFORMATION_SUCCESS_FETCH]:
      (state, { payload:
        {
            enrollmentsSortedByDate,
            teiDisplayName,
            tetDisplayName,
        },
      }) => ({
          ...state,
          enrollments: enrollmentsSortedByDate,
          enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
          teiDisplayName,
          tetDisplayName,
      }),
    [DEFAULT_VIEW]:
      state => ({
          ...state,
          enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
      }),
    [ZERO_ENROLLMENTS_VIEW]:
      state => ({
          ...state,
          enrollmentPageStatus: enrollmentPageStatuses.TRACKER_PROGRAM_WITH_ZERO_ENROLLMENTS_SELECTED,
      }),
    [MISSING_ENROLLMENT_VIEW]:
      state => ({
          ...state,
          enrollmentPageStatus: enrollmentPageStatuses.MISSING_ENROLLMENT_SELECTION,
      }),
    [MISSING_PROGRAM_VIEW]:
      state => ({
          ...state,
          enrollmentPageStatus: enrollmentPageStatuses.MISSING_PROGRAM_SELECTION,
      }),
    [EVENT_PROGRAM_SELECTED_VIEW]:
      state => ({
          ...state,
          enrollmentPageStatus: enrollmentPageStatuses.EVENT_PROGRAM_SELECTED,
      }),
    [PAGE_CLEAN]: () => initialReducerValue,
}, 'enrollmentPage', initialReducerValue);
