// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentPageActionTypes } from '../../components/Pages/Enrollment/EnrollmentPage.actions';
import {
    enrollmentPageStatuses,
    enrollmentAccessLevels,
    selectionStatus,
} from '../../components/Pages/Enrollment/EnrollmentPage.constants';

const initialReducerValue = {
    pageOpen: true,
    enrollmentPageStatus: null,
    enrollmentAccessLevel: enrollmentAccessLevels.UNKNOWN_ACCESS,
    fetchStatus: {
        enrollmentId: selectionStatus.READY,
        programId: selectionStatus.READY,
        teiId: selectionStatus.READY,
    },
};
const {
    PAGE_OPEN,
    PAGE_CLOSE,
    RESET_ENROLLMENT_ID,
    FETCH_ENROLLMENT_ID,
    FETCH_ENROLLMENT_ID_SUCCESS,
    FETCH_ENROLLMENT_ID_ERROR,
    FETCH_TEI,
    FETCH_TEI_SUCCESS,
    FETCH_TEI_ERROR,
    COMMIT_TRACKER_PROGRAM_ID,
    COMMIT_NON_TRACKER_PROGRAM_ID,
    PROGRAM_ID_ERROR,
    FETCH_ENROLLMENTS,
    FETCH_ENROLLMENTS_ERROR,
    FETCH_ENROLLMENTS_SUCCESS,
    DEFAULT_VIEW,
    LOADING_VIEW,
    MISSING_MESSAGE_VIEW,
    ERROR_VIEW,
    DELETE_ENROLLMENT,
    UPDATE_TEI_DISPLAY_NAME,
    UPDATE_ENROLLMENT_DATE,
} = enrollmentPageActionTypes;

export const enrollmentPageDesc = createReducerDescription({
    [PAGE_OPEN]:
        () => initialReducerValue,
    [PAGE_CLOSE]:
        state => ({
            ...state,
            pageOpen: false,
        }),
    [RESET_ENROLLMENT_ID]:
        ({ enrollmentId, ...state }) => ({
            ...state,
            fetchStatus: {
                ...state.fetchStatus,
                enrollmentId: selectionStatus.READY,
            },
        }),
    [FETCH_ENROLLMENT_ID]:
        ({ programId, teiId, enrollments, ...state }, { payload: { enrollmentId } }) => ({
            ...state,
            enrollmentId,
            fetchStatus: {
                ...state.fetchStatus,
                enrollmentId: selectionStatus.LOADING,
            },
            enrollmentPageStatus: enrollmentPageStatuses.LOADING,
        }),
    [FETCH_ENROLLMENT_ID_SUCCESS]:
        state => ({
            ...state,
            fetchStatus: {
                ...state.fetchStatus,
                enrollmentId: selectionStatus.READY,
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
    [FETCH_TEI]:
        ({ enrollments, ...state }, { payload: { teiId } }) => ({
            ...state,
            teiId,
            fetchStatus: {
                ...state.fetchStatus,
                teiId: selectionStatus.LOADING,
            },
            enrollmentPageStatus: enrollmentPageStatuses.LOADING,
            enrollmentAccessLevel: enrollmentAccessLevels.UNKNOWN_ACCESS,
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
    [FETCH_TEI_ERROR]:
        state => ({
            ...state,
            fetchStatus: {
                ...state.fetchStatus,
                teiId: selectionStatus.ERROR,
            },
        }),
    [COMMIT_TRACKER_PROGRAM_ID]:
        ({ enrollments, ...state }, { payload: { programId } }) => ({
            ...state,
            programId,
            fetchStatus: {
                ...state.fetchStatus,
                programId: selectionStatus.READY,
            },
            enrollmentAccessLevel: enrollmentAccessLevels.UNKNOWN_ACCESS,
        }),
    [COMMIT_NON_TRACKER_PROGRAM_ID]:
        ({ enrollments, ...state }, { payload: { programId } }) => ({
            ...state,
            programId,
            fetchStatus: {
                ...state.fetchStatus,
                programId: selectionStatus.ERROR,
            },
            enrollmentAccessLevel: enrollmentAccessLevels.UNKNOWN_ACCESS,
        }),
    [PROGRAM_ID_ERROR]:
        (state, { payload: { programId } }) => ({
            ...state,
            programId,
            fetchStatus: {
                ...state.fetchStatus,
                programId: selectionStatus.ERROR,
            },
        }),
    [FETCH_ENROLLMENTS]:
        ({ enrollments, ...state }) => ({
            ...state,
            enrollmentPageStatus: enrollmentPageStatuses.LOADING,
            enrollmentAccessLevel: enrollmentAccessLevels.UNKNOWN_ACCESS,
        }),
    [FETCH_ENROLLMENTS_SUCCESS]:
        (state, { payload: { enrollments } }) => ({
            ...state,
            enrollments,
            enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
            enrollmentAccessLevel: enrollmentAccessLevels.FULL_ACCESS,
        }),
    [FETCH_ENROLLMENTS_ERROR]:
        ({ enrollments, ...state }, { payload: { accessLevel } }) => ({
            ...state,
            enrollmentPageStatus: enrollmentPageStatuses.MISSING_SELECTIONS,
            enrollmentAccessLevel: accessLevel,
        }),
    [DEFAULT_VIEW]:
        state => ({
            ...state,
            enrollmentPageStatus: enrollmentPageStatuses.DEFAULT,
        }),
    [LOADING_VIEW]:
        state => ({
            ...state,
            enrollmentPageStatus: enrollmentPageStatuses.LOADING,
        }),
    [MISSING_MESSAGE_VIEW]:
        state => ({
            ...state,
            enrollmentPageStatus: enrollmentPageStatuses.MISSING_SELECTIONS,
        }),
    [ERROR_VIEW]:
        state => ({
            ...state,
            enrollmentPageStatus: enrollmentPageStatuses.ERROR,
        }),
    [UPDATE_TEI_DISPLAY_NAME]:
        (state, { payload: { teiDisplayName } }) => ({
            ...state,
            teiDisplayName,
        }),
    [UPDATE_ENROLLMENT_DATE]:
        (state, { payload: { enrollmentId, enrollmentDate } }) => ({
            ...state,
            enrollments: state.enrollments.map((enrollment) => {
                if (enrollment.enrollment === enrollmentId) {
                    enrollment.enrolledAt = enrollmentDate;
                }
                return enrollment;
            }),
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
