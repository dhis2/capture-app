// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentActionTypes } from '../../components/Pages/common/EnrollmentOverviewDomain/enrollment.actions';
import { actionTypes as enrollmentNoteActionTypes }
    from '../../components/WidgetEnrollmentComment/WidgetEnrollmentComment.actions';

const initialReducerValue = {};
const {
    SET_ENROLLMENT,
    UPDATE_ENROLLMENT_EVENTS,
    UPDATE_ENROLLMENT_EVENTS_WITHOUT_ID,
    ROLLBACK_ENROLLMENT_EVENT,
    ROLLBACK_ENROLLMENT_EVENT_WITHOUT_ID,
    COMMIT_ENROLLMENT_EVENT,
    COMMIT_ENROLLMENT_EVENT_WITHOUT_ID,
} = enrollmentActionTypes;

export const enrollmentDesc = createReducerDescription(
    {
        [SET_ENROLLMENT]: (state, { payload: { enrollmentSite } }) => ({
            ...state,
            ...enrollmentSite,
        }),
        [UPDATE_ENROLLMENT_EVENTS]: (
            state,
            { payload: { eventId, eventData } },
        ) => {
            const events = state.events?.map(event =>
                (event.event === eventId
                    ? {
                        ...eventData,
                        pendingApiResponse: true,
                        dataToRollback: event,
                    }
                    : event),
            );

            return { ...state, events };
        },
        [ROLLBACK_ENROLLMENT_EVENT]: (state, { payload: { eventId } }) => {
            const events = state.events?.map(event =>
                (event.event === eventId ? event.dataToRollback : event),
            );

            return { ...state, events };
        },
        [COMMIT_ENROLLMENT_EVENT]: (state, { payload: { eventId } }) => {
            const events = state.events?.map((event) => {
                if (event.event === eventId) {
                    const {
                        pendingApiResponse,
                        dataToRollback,
                        ...dataToCommit
                    } = event;
                    return dataToCommit;
                }
                return event;
            });

            return { ...state, events };
        },
        [UPDATE_ENROLLMENT_EVENTS_WITHOUT_ID]: (
            state,
            { payload: { eventData, uid } },
        ) => {
            const events = [...state.events, { ...eventData, uid, pendingApiResponse: true }];
            return { ...state, events };
        },
        [ROLLBACK_ENROLLMENT_EVENT_WITHOUT_ID]: (state, { payload: { uid } }) => {
            const events = state.events?.filter(event => (event.uid !== uid));
            return { ...state, events };
        },
        [COMMIT_ENROLLMENT_EVENT_WITHOUT_ID]: (state, { payload: { eventId, uid } }) => {
            const events = state.events?.map((event) => {
                if (event.uid === uid) {
                    const { pendingApiResponse, uid: uidToRemove, ...dataToCommit } = event;
                    return { ...dataToCommit, event: eventId };
                }
                return event;
            });
            return { ...state, events };
        },
        [enrollmentNoteActionTypes.ADD_ENROLLMENT_NOTE]:
        (state, { payload: { note } }) => ({ ...state, notes: [...state.notes, note] }),
    },
    'enrollmentSite',
    initialReducerValue,
);
