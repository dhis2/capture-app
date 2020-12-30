// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentPageActionTypes } from '../../components/Pages/Enrollment/EnrollmentPage.actions';
import { enrollmentPageStatuses } from '../../components/Pages/Enrollment/EnrollmentPage.constants';

const initialReducerValue = {
    enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
};
const {
    ENROLLMENT_PAGE_INITIAL_VIEW_DISPLAY,
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_LOADING,
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_ERROR,
    ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_SUCCESS,
} = enrollmentPageActionTypes;

export const enrollmentPageDesc = createReducerDescription({
    [ENROLLMENT_PAGE_INITIAL_VIEW_DISPLAY]: state => ({
        ...state,
        enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
    }),
    [ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_LOADING]: state => ({
        ...state,
        enrollmentPageStatus: enrollmentPageStatuses.LOADING,
    }),
    [ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_ERROR]: state => ({
        ...state,
        enrollmentPageStatus: enrollmentPageStatuses.ERROR,
    }),
    [ENROLLMENT_PAGE_INFORMATION_BASED_ON_ID_FROM_URL_FETCH_SUCCESS]:
      (state, { payload: { selectedEnrollment, enrollmentsSortedByDate } }) => ({
          ...state,
          selectedEnrollment,
          enrollments: enrollmentsSortedByDate,
          enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
      }),
}, 'enrollmentPage', initialReducerValue);
