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
    MISSING_MESSAGE_VIEW,
    DELETE_ENROLLMENT,
    UPDATE_TEI_DISPLAY_NAME,
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
            tetId,
        },
      }) => ({
          ...state,
          enrollments: enrollmentsSortedByDate,
          enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
          teiDisplayName,
          tetId,
      }),
    [DEFAULT_VIEW]:
      state => ({
          ...state,
          enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
      }),
    [MISSING_MESSAGE_VIEW]:
      state => ({
          ...state,
          enrollmentPageStatus: enrollmentPageStatuses.MISSING_SELECTIONS,
      }),
    [UPDATE_TEI_DISPLAY_NAME]:
       (state, { payload: { teiDisplayName },
       }) => ({
           ...state,
           teiDisplayName,
       }),
    [PAGE_CLEAN]: () => initialReducerValue,
    [DELETE_ENROLLMENT]: (state, { payload: { enrollmentId } }) => ({
        ...state,
        enrollments: [
            ...state.enrollments.filter(
                item => item.enrollment !== enrollmentId,
            ),
        ],
    }),
}, 'enrollmentPage', initialReducerValue);
