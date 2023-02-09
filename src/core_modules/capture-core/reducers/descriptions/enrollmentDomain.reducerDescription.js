// @flow
import { createReducerDescription } from '../../trackerRedux';
import { enrollmentSiteActionTypes } from '../../components/Pages/common/EnrollmentOverviewDomain';
import { actionTypes as enrollmentNoteActionTypes }
    from '../../components/WidgetEnrollmentComment/WidgetEnrollmentComment.actions';
import { actionTypes as editEventActionTypes } from '../../components/WidgetEventEdit/EditEventDataEntry/editEventDataEntry.actions';

const initialReducerValue = {};
const {
    COMMON_ENROLLMENT_SITE_DATA_SET,
    UPDATE_ENROLLMENT_EVENTS,
    UPDATE_ENROLLMENT_EVENTS_WITHOUT_ID,
    UPDATE_ENROLLMENT_ATTRIBUTE_VALUES,
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
            enrollmentId: enrollment?.enrollment,
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
            { payload: { events } },
        ) => {
            const eventsWithoutId = events.map(event => ({ ...event, pendingApiResponse: true }));
            const enrollmentEvents = [...state.enrollment.events, ...eventsWithoutId];

            return { ...state, enrollment: { ...state.enrollment, events: enrollmentEvents } };
        },
        [ROLLBACK_ENROLLMENT_EVENT_WITHOUT_ID]: (state, { payload: { events } }) => {
            const comittedEventIds = events.map(event => event.event);
            const enrollmentEvents = state.enrollment.events.filter(event => !comittedEventIds.includes(event.event));

            return { ...state, enrollment: { ...state.enrollment, events: enrollmentEvents } };
        },
        [COMMIT_ENROLLMENT_EVENT_WITHOUT_ID]: (state, { payload: { events } }) => {
            const comittedEventIds = events.map(event => event.uid);
            const enrollmentEvents = state.enrollment.events?.map((event) => {
                if (comittedEventIds.includes(event.event)) {
                    const { pendingApiResponse, uid: uidToRemove, ...dataToCommit } = event;
                    return { ...dataToCommit };
                }
                return event;
            });
            return { ...state, enrollment: { ...state.enrollment, events: enrollmentEvents } };
        },
        [UPDATE_ENROLLMENT_ATTRIBUTE_VALUES]: (state, { payload: { attributeValues } }) => ({
            ...state,
            attributeValues,
        }),
        [enrollmentNoteActionTypes.ADD_ENROLLMENT_NOTE]:
        (state, { payload: { note } }) => ({
            ...state,
            enrollment: {
                ...state.enrollment,
                notes: [...state.enrollment.notes, note],
            },
        }),
        [editEventActionTypes.REQUEST_DELETE_EVENT_DATA_ENTRY]: (state, { payload: { eventId } }) => {
            const events = state.enrollment.events?.map((event) => {
                if (event.event === eventId) {
                    return { ...event, pendingApiResponse: true };
                }
                return event;
            });
            return { ...state, enrollment: { ...state.enrollment, events } };
        },
        [editEventActionTypes.DELETE_EVENT_DATA_ENTRY_SUCCEEDED]: (state, { meta: { eventId } }) => {
            const newEnrollmentEvent = state.enrollment.events?.filter(item => item.event !== eventId);
            return {
                ...state,
                enrollment: {
                    ...state.enrollment,
                    events: newEnrollmentEvent,
                },
            };
        },
        [editEventActionTypes.DELETE_EVENT_DATA_ENTRY_FAILED]: (state, { meta: { eventId } }) => {
            const events = state.enrollment.events?.map((event) => {
                if (event.event === eventId) {
                    const { pendingApiResponse, ...dataToCommit } = event;
                    return { ...dataToCommit, event: eventId };
                }
                return event;
            });
            return { ...state, enrollment: { ...state.enrollment, events } };
        },
    },
    'enrollmentDomain',
    initialReducerValue,
);
