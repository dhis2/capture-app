// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentPageActionTypes } from '../../components/Pages/Enrollment/EnrollmentPage.actions';
import {
    enrollmentPageStatuses,
    enrollmentAccessLevels,
} from '../../components/Pages/Enrollment/EnrollmentPage.constants';

const initialReducerValue = {
    enrollmentPageStatus: null,
};
const {
    INFORMATION_LOADING_FETCH,
    INFORMATION_ERROR_FETCH,
    INFORMATION_SUCCESS_FETCH,
    ENROLLMENTS_ERROR_FETCH,
    ENROLLMENTS_SUCCESS_FETCH,
    PAGE_CLEAN,
    DEFAULT_VIEW,
    MISSING_MESSAGE_VIEW,
    DELETE_ENROLLMENT,
    UPDATE_TEI_DISPLAY_NAME,
    SET_EVENT_RELATIONSHIPS_DATA,
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
            teiDisplayName,
            tetId,
        },
      }) => ({
          ...state,
          enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
          teiDisplayName,
          tetId,
      }),
    [ENROLLMENTS_ERROR_FETCH]:
      ({ enrollments, ...state }, { payload: { accessLevel, programId } }) => ({
          ...state,
          programId,
          enrollmentPageStatus: enrollmentPageStatuses.MISSING_SELECTIONS,
          enrollmentAccessLevel: accessLevel,
      }),
    [ENROLLMENTS_SUCCESS_FETCH]:
      (state, { payload: { enrollments, programId } }) => ({
          ...state,
          programId,
          enrollments,
          enrollmentAccessLevel: enrollmentAccessLevels.FULL_ACCESS,
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
    [SET_EVENT_RELATIONSHIPS_DATA]: (state, { payload: { eventId, relationships } }) => ({
        ...state,
        eventId,
        relationships,
    }),
    [DELETE_ENROLLMENT]: (state, { payload: { enrollmentId } }) => ({
        ...state,
        enrollments: [
            ...state.enrollments.filter(
                item => item.enrollment !== enrollmentId,
            ),
        ],
    }),

}, 'enrollmentPage', initialReducerValue);
