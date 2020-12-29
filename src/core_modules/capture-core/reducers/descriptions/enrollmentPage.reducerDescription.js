// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentPageActionTypes } from '../../components/Pages/Enrollment/EnrollmentPage.actions';
import { enrollmentPageStatuses } from '../../components/Pages/Enrollment/EnrollmentPage.constants';

const initialReducerValue = {
    enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
};
export const enrollmentPageDesc = createReducerDescription({
    [enrollmentPageActionTypes.ENROLLMENT_PAGE_INITIAL_VIEW_DISPLAY]: state => ({
        ...state,
        enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
    }),
    [enrollmentPageActionTypes.ENROLLMENT_PAGE_LOADING_VIEW_DISPLAY]: state => ({
        ...state,
        enrollmentPageStatus: enrollmentPageStatuses.LOADING,
    }),
    [enrollmentPageActionTypes.ENROLLMENT_PAGE_ERROR_VIEW_DISPLAY]: state => ({
        ...state,
        enrollmentPageStatus: enrollmentPageStatuses.ERROR,
    }),
}, 'enrollmentPage', initialReducerValue);
