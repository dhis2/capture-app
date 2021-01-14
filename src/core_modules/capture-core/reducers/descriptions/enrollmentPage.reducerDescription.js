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
      (state, { payload: { enrollmentsSortedByDate, selectedName } }) => ({
          ...state,
          enrollments: enrollmentsSortedByDate,
          enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
          trackedEntityInstanceDisplayName: selectedName,
      }),
    [DEFAULT_VIEW]:
      state => ({
          ...state,
          enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
      }),
    [PAGE_CLEAN]: () => initialReducerValue,
}, 'enrollmentPage', initialReducerValue);
