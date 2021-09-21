// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentSiteActionTypes } from '../../components/Pages/common/EnrollmentOverviewDomain';
import { actionTypes as enrollmentNoteActionTypes }
    from '../../components/WidgetEnrollmentComment/WidgetEnrollmentComment.actions';

const initialReducerValue = {};
const {
    COMMON_ENROLLMENT_SITE_DATA_SET,
    UPDATE_ENROLLMENT_EVENTS,
    UPDATE_ENROLLMENT_EVENTS_WITHOUT_ID,
    ROLLBACK_ENROLLMENT_EVENT,
    ROLLBACK_ENROLLMENT_EVENT_WITHOUT_ID,
    COMMIT_ENROLLMENT_EVENT,
    COMMIT_ENROLLMENT_EVENT_WITHOUT_ID,
} = enrollmentSiteActionTypes;

export const enrollmentDomainDesc = createReducerDescription(
    {
        [COMMON_ENROLLMENT_SITE_DATA_SET]: (state, { payload: { enrollment, attributeValues } }) => ({
            ...state,
            enrollment,
            attributeValues,
            enrollmentId: enrollment.enrollment,
        }),
        [UPDATE_ENROLLMENT_EVENTS]: (
            state,
            { payload: { eventId, eventData } },
        ) => {
            const events = state.enrollment.events?.map(event =>
                (event.event === eventId
                    ? {
                        ...eventData,
                        pendingApiResponse: true,
                        dataToRollback: event,
                    }
                    : event),
            );

            return { ...state, enrollment: { ...state.enrollment, events } };
        },
        [ROLLBACK_ENROLLMENT_EVENT]: (state, { payload: { eventId } }) => {
            const events = state.enrollment.events?.map(event =>
                (event.event === eventId ? event.dataToRollback : event),
            );

            return { ...state, enrollment: { ...state.enrollment, events } };
        },
        [COMMIT_ENROLLMENT_EVENT]: (state, { payload: { eventId } }) => {
            const events = state.enrollment.events?.map((event) => {
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

            return { ...state, enrollment: { ...state.enrollment, events } };
        },
        [UPDATE_ENROLLMENT_EVENTS_WITHOUT_ID]: (
            state,
            { payload: { eventData, uid } },
        ) => {
            const events = [...state.enrollment.events, { ...eventData, uid, pendingApiResponse: true }];

            return { ...state, enrollment: { ...state.enrollment, events } };
        },
        [ROLLBACK_ENROLLMENT_EVENT_WITHOUT_ID]: (state, { payload: { uid } }) => {
            const events = state.enrollment.events.filter(event => (event.uid !== uid));

            return { ...state, enrollment: { ...state.enrollment, events } };
        },
        [COMMIT_ENROLLMENT_EVENT_WITHOUT_ID]: (state, { payload: { eventId, uid } }) => {
            const events = state.enrollment.events?.map((event) => {
                if (event.uid === uid) {
                    const { pendingApiResponse, uid: uidToRemove, ...dataToCommit } = event;
                    return { ...dataToCommit, event: eventId };
                }
                return event;
            });
            return { ...state, enrollment: { ...state.enrollment, events } };
        },
        [enrollmentNoteActionTypes.ADD_ENROLLMENT_NOTE]:
        (state, { payload: { note } }) => ({
            ...state,
            enrollment: {
                ...state.enrollment,
                notes: [...state.enrollment.notes, note],
            },
        }),
    },
    'enrollmentDomain',
    initialReducerValue,
);
