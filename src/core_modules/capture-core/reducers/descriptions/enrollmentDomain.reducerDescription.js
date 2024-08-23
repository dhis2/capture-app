// @flow
import { createReducerDescription } from '../../trackerRedux';
import { enrollmentSiteActionTypes } from '../../components/Pages/common/EnrollmentOverviewDomain';
import { actionTypes as enrollmentNoteActionTypes }
    from '../../components/WidgetEnrollmentNote/WidgetEnrollmentNote.actions';
import { actionTypes as editEventActionTypes } from '../../components/WidgetEventEdit/EditEventDataEntry/editEventDataEntry.actions';
import { newEventWidgetActionTypes } from '../../components/WidgetEnrollmentEventNew/Validated/validated.actions';
import { enrollmentEditEventActionTypes } from '../../components/Pages/EnrollmentEditEvent';

const initialReducerValue = {};
const {
    COMMON_ENROLLMENT_SITE_DATA_SET,
    UPDATE_ENROLLMENT_DATE,
    UPDATE_INCIDENT_DATE,
    UPDATE_ENROLLMENT_EVENT,
    UPDATE_OR_ADD_ENROLLMENT_EVENTS,
    UPDATE_ENROLLMENT_ATTRIBUTE_VALUES,
    UPDATE_ENROLLMENT_AND_EVENTS,
    ROLLBACK_ENROLLMENT_EVENT,
    ROLLBACK_ENROLLMENT_EVENTS,
    ROLLBACK_ENROLLMENT_AND_EVENTS,
    COMMIT_ENROLLMENT_EVENT,
    COMMIT_ENROLLMENT_EVENTS,
    ADD_PERSISTED_ENROLLMENT_EVENTS,
    COMMIT_ENROLLMENT_AND_EVENTS,
    DELETE_ENROLLMENT_EVENT,
    UPDATE_ENROLLMENT_EVENT_STATUS,
} = enrollmentSiteActionTypes;

const setAssignee = (state, action) => {
    const { assignedUser, eventId } = action.payload;

    const events = state.enrollment.events.reduce(
        (acc, e) => (e.event === eventId ? [...acc, { ...e, assignedUser }] : [...acc, e]),
        [],
    );

    return { ...state, enrollment: { ...state.enrollment, events } };
};

export const enrollmentDomainDesc = createReducerDescription(
    {
        [COMMON_ENROLLMENT_SITE_DATA_SET]: (state, { payload: { enrollment, attributeValues } }) => ({
            ...state,
            enrollment,
            attributeValues,
            enrollmentId: enrollment?.enrollment,
        }),
        [UPDATE_ENROLLMENT_DATE]: (state, { payload: { enrollmentDate } }) => ({
            ...state,
            enrollment: {
                ...state.enrollment,
                enrolledAt: enrollmentDate,
            },
        }),
        [UPDATE_INCIDENT_DATE]: (state, { payload: { incidentDate } }) => ({
            ...state,
            enrollment: {
                ...state.enrollment,
                occurredAt: incidentDate,
            },
        }),
        // Update a single event - used in EditEventDataEntry
        [UPDATE_ENROLLMENT_EVENT]: (
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
        // Rollback a single event - used in EditEventDataEntry
        [ROLLBACK_ENROLLMENT_EVENT]: (state, { payload: { eventId } }) => {
            const events = state.enrollment.events?.map(event =>
                (event.event === eventId ? event.dataToRollback : event),
            );

            return { ...state, enrollment: { ...state.enrollment, events } };
        },
        [COMMIT_ENROLLMENT_EVENT]: (state, { payload: { eventId } }) => {
            const events = state.enrollment?.events?.map((event) => {
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
        [DELETE_ENROLLMENT_EVENT]: (state, { payload: { eventId } }) => {
            const events = state.enrollment.events?.filter(event => event.event !== eventId);
            return { ...state, enrollment: { ...state.enrollment, events } };
        },
        [UPDATE_ENROLLMENT_EVENT_STATUS]: (state, { payload: { eventId, status, updatedAt } }) => {
            const events = state.enrollment.events?.map(event =>
                (event.event === eventId
                    ? { ...event, status, updatedAt }
                    : event),
            );

            return { ...state, enrollment: { ...state.enrollment, events } };
        },
        [UPDATE_OR_ADD_ENROLLMENT_EVENTS]: (
            state,
            { payload: { events } },
        ) => {
            const eventsSentToServer = events.map(event => ({ ...event, pendingApiResponse: true }));

            // Update if the event already exists in state.enrollment.events or add if it doesn't
            const enrollmentEvents = state.enrollment.events
                .map((event) => {
                    const eventToUpdate = eventsSentToServer.find(e => e.event === event.event);
                    return eventToUpdate
                        ? {
                            ...eventToUpdate,
                            dataToRollback: event,
                        }
                        : event;
                })
                .concat(
                    eventsSentToServer.filter(
                        event => !state.enrollment.events.some(e => e.event === event.event),
                    ),
                );

            return {
                ...state,
                enrollment: {
                    ...state.enrollment,
                    events: enrollmentEvents,
                },
            };
        },
        [ADD_PERSISTED_ENROLLMENT_EVENTS]: (
            state,
            { payload: { events } },
        ) => {
            const enrollmentEvents = [...state.enrollment.events, ...events];

            return { ...state, enrollment: { ...state.enrollment, events: enrollmentEvents } };
        },
        [ROLLBACK_ENROLLMENT_EVENTS]: (state, { payload: { events } }) => {
            const eventsToRollback = events.map(event => event.event);

            // Iterate over the events in state.enrollment.events and rollback the ones that are in eventsToRollback. If the event has dataToRollback, use that, otherwise remove it from state.enrollment.events
            const enrollmentEvents = state.enrollment.events.map((event) => {
                if (eventsToRollback.includes(event.event)) {
                    return event.dataToRollback ? event.dataToRollback : null;
                }
                return event;
            }).filter(Boolean);

            return { ...state, enrollment: { ...state.enrollment, events: enrollmentEvents } };
        },
        [COMMIT_ENROLLMENT_EVENTS]: (state, { payload: { events } }) => {
            const comittedEventIds = events.map(event => event.uid);
            const enrollmentEvents = state.enrollment?.events?.map((event) => {
                if (comittedEventIds.includes(event.event)) {
                    const { pendingApiResponse, uid: uidToRemove, dataToRollback, ...dataToCommit } = event;
                    return { ...dataToCommit };
                }
                return event;
            });
            return { ...state, enrollment: { ...state.enrollment, events: enrollmentEvents } };
        },
        [UPDATE_ENROLLMENT_AND_EVENTS]: (state, { payload: { enrollment } }) => {
            const enrollmentToUpdate = { ...enrollment, pendingApiResponse: true, dataToRollback: state.enrollment };

            if (enrollmentToUpdate.events?.length > 0) {
                // Update if the event already exists in state.enrollment.events or add if it doesn't
                const events = state.enrollment.events
                    .map((event) => {
                        const eventToUpdate = enrollmentToUpdate.events.find(e => e.event === event.event);
                        return eventToUpdate
                            ? {
                                ...eventToUpdate,
                                pendingApiResponse: true,
                                dataToRollback: event,
                            }
                            : event;
                    })
                    .concat(
                        enrollmentToUpdate.events
                            .filter(
                                event => !state.enrollment.events.some(e => e.event === event.event),
                            )
                            .map(event => ({ ...event, pendingApiResponse: true })),
                    );

                return { ...state, enrollment: { ...state.enrollment, ...enrollmentToUpdate, events } };
            }

            return { ...state, enrollment: { ...state.enrollment, ...enrollmentToUpdate } };
        },
        [ROLLBACK_ENROLLMENT_AND_EVENTS]: (state, { payload: { uid } }) => {
            const enrollment = state.enrollment.dataToRollback;

            const events = state.enrollment.events.reduce((acc, event) => {
                if (uid && event.uid === uid) {
                    return acc;
                } else if (event.pendingApiResponse && !event.dataToRollback) {
                    return acc;
                }
                const eventToRollback = event.dataToRollback ? event.dataToRollback : event;
                return [...acc, eventToRollback];
            }, []);

            return { ...state, enrollment: { ...enrollment, events } };
        },
        [COMMIT_ENROLLMENT_AND_EVENTS]: (state, { payload: { eventId, uid } }) => {
            const { pendingApiResponse, dataToRollback, ...enrollmentToCommit } = state.enrollment;
            const eventsToCommit = state.enrollment.events.map((event) => {
                const id = uid && event.uid === uid ? eventId : event.event;
                const {
                    pendingApiResponse: pendingApiResponseEvent,
                    dataToRollback: dataToRollbackEvent,
                    uid: uidToRemove,
                    ...dataToCommit
                } = event;
                return { ...dataToCommit, event: id };
            });

            return { ...state, enrollment: { ...enrollmentToCommit, events: eventsToCommit } };
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
        // Used to determine navigation logic in the new event widget
        [newEventWidgetActionTypes.SET_SAVE_ENROLLMENT_EVENT_IN_PROGRESS]: (state, { payload }) => ({
            ...state,
            eventSaveInProgress: payload,
        }),
        [newEventWidgetActionTypes.CLEAN_UP_EVENT_SAVE_IN_PROGRESS]: (state) => {
            const { eventSaveInProgress, ...newState } = state;
            return newState;
        },
        // Assignee
        [enrollmentEditEventActionTypes.ASSIGNEE_SET]: setAssignee,
        [enrollmentEditEventActionTypes.ASSIGNEE_SAVE_FAILED]: setAssignee,
    },
    'enrollmentDomain',
    initialReducerValue,
);
