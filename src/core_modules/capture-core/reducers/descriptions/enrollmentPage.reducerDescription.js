// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentPageActionTypes } from '../../components/Pages/Enrollment/EnrollmentPage.actions';
import {
    enrollmentPageStatuses,
    enrollmentAccessLevels,
    selectionStatus,
} from '../../components/Pages/Enrollment/EnrollmentPage.constants';

const initialReducerValue = {
    enrollmentPageStatus: null,
    fetchStatus: {
        enrollmentId: selectionStatus.READY,
        teiId: selectionStatus.READY,
    },
};
const {
    INFORMATION_LOADING_FETCH,
    INFORMATION_ERROR_FETCH,
    INFORMATION_SUCCESS_FETCH,
    FETCH_ENROLLMENT_ID,
    FETCH_ENROLLMENT_ID_SUCCESS,
    FETCH_ENROLLMENT_ID_ERROR,
    FETCH_TEI,
    FETCH_TEI_SUCCESS,
    FETCH_TEI_ERROR,
    COMMIT_PROGRAM_ID,
    FETCH_ENROLLMENTS_ERROR,
    FETCH_ENROLLMENTS_SUCCESS,
    PAGE_CLEAN,
    DEFAULT_VIEW,
    MISSING_MESSAGE_VIEW,
    DELETE_ENROLLMENT,
    UPDATE_TEI_DISPLAY_NAME,
    UPDATE_ENROLLMENT_DATE,
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
          teiDisplayName,
          tetId,
      }),
    [FETCH_ENROLLMENT_ID]:
        (state, { payload: { enrollmentId } }) => ({
            ...state,
            enrollmentId,
            fetchStatus: {
                ...state.fetchStatus,
                enrollmentId: selectionStatus.LOADING,
            },
        }),
    [FETCH_TEI]:
        ({ enrollments, ...state }, { payload: { teiId } }) => ({
            ...state,
            teiId,
            fetchStatus: {
                ...state.fetchStatus,
                teiId: selectionStatus.LOADING,
            },
            enrollmentAccessLevel: enrollmentAccessLevels.UNKNOWN_ACCESS,
        }),
    [FETCH_ENROLLMENT_ID_SUCCESS]:
        (state, { payload: { programId } }) => ({
            ...state,
            fetchStatus: {
                ...state.fetchStatus,
                enrollmentId: selectionStatus.READY,
            },
        }),
    [FETCH_TEI_SUCCESS]:
        (state, { payload: { tetId, teiDisplayName } }) => ({
            ...state,
            tetId,
            teiDisplayName,
            fetchStatus: {
                ...state.fetchStatus,
                teiId: selectionStatus.READY,
            },
        }),
    [FETCH_ENROLLMENT_ID_ERROR]:
        state => ({
            ...state,
            fetchStatus: {
                ...state.fetchStatus,
                enrollmentId: selectionStatus.ERROR,
            },
        }),
    [FETCH_TEI_ERROR]:
        state => ({
            ...state,
            fetchStatus: {
                ...state.fetchStatus,
                teiId: selectionStatus.ERROR,
            },
        }),
    [COMMIT_PROGRAM_ID]:
        ({ enrollments, ...state }, { payload: { programId } }) => ({
            ...state,
            programId,
            enrollmentPageStatus: programId ? state.enrollmentPageStatus : enrollmentPageStatuses.MISSING_SELECTIONS,
            enrollmentAccessLevel: enrollmentAccessLevels.UNKNOWN_ACCESS,
        }),
    [FETCH_ENROLLMENTS_ERROR]:
        ({ enrollments, ...state }, { payload: { accessLevel } }) => ({
            ...state,
            enrollmentPageStatus: enrollmentPageStatuses.MISSING_SELECTIONS,
            enrollmentAccessLevel: accessLevel,
        }),
    [FETCH_ENROLLMENTS_SUCCESS]:
        (state, { payload: { enrollments, programId } }) => ({
            ...state,
            programId,
            enrollments,
            enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
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
        (state, { payload: { teiDisplayName } }) => ({
            ...state,
            teiDisplayName,
        }),
    [UPDATE_ENROLLMENT_DATE]:
        (state, { payload: { enrollmentId, enrollmentDate } }) => ({
            ...state,
            enrollments: state.enrollments.map(enrollment => {
                if (enrollment.enrollment === enrollmentId) {
                    enrollment.enrolledAt = enrollmentDate;
                }
                return enrollment;
            }),
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
