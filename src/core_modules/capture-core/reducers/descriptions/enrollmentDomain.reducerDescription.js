// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentSiteActionTypes } from '../../components/Pages/common/EnrollmentOverviewDomain';
import { actionTypes as enrollmentNoteActionTypes }
    from '../../components/WidgetEnrollmentComment/WidgetEnrollmentComment.actions';
import { actionTypes as editEventActionTypes } from '../../components/WidgetEventEdit/EditEventDataEntry/editEventDataEntry.actions';
import { enrollmentEditEventActionTypes } from '../../components/Pages/EnrollmentEditEvent';

const initialReducerValue = {};
const {
    COMMON_ENROLLMENT_SITE_DATA_SET,
    UPDATE_ENROLLMENT_DATE,
    UPDATE_INCIDENT_DATE,
    UPDATE_ENROLLMENT_EVENT,
    UPDATE_ENROLLMENT_EVENT_WITHOUT_ID,
    UPDATE_ENROLLMENT_ATTRIBUTE_VALUES,
    UPDATE_ENROLLMENT_AND_EVENTS,
    ROLLBACK_ENROLLMENT_EVENT,
    ROLLBACK_ENROLLMENT_EVENT_WITHOUT_ID,
    ROLLBACK_ENROLLMENT_AND_EVENTS,
    COMMIT_ENROLLMENT_EVENT,
    COMMIT_ENROLLMENT_EVENT_WITHOUT_ID,
    COMMIT_ENROLLMENT_AND_EVENTS,
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
        [UPDATE_ENROLLMENT_EVENT_WITHOUT_ID]: (
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
            const events = state.enrollment?.events?.map((event) => {
                if (event.uid === uid) {
                    const { pendingApiResponse, uid: uidToRemove, ...dataToCommit } = event;
                    return { ...dataToCommit, event: eventId };
                }
                return event;
            });
            return { ...state, enrollment: { ...state.enrollment, events } };
        },
        [UPDATE_ENROLLMENT_ATTRIBUTE_VALUES]: (state, { payload: { attributeValues } }) => ({
            ...state,
            attributeValues,
        }),
        [UPDATE_ENROLLMENT_AND_EVENTS]: (state, { payload: { enrollment } }) => {
            const enrollmentToUpdate = { ...enrollment, pendingApiResponse: true, dataToRollback: state.enrollment };

            if (enrollmentToUpdate.events?.length > 0) {
                const eventsToUpdate = state.enrollment.events.map((event) => {
                    const eventToUpdate = enrollmentToUpdate.events.find(e => e.event === event.event);
                    return eventToUpdate
                        ? {
                            ...eventToUpdate,
                            pendingApiResponse: true,
                            dataToRollback: event,
                        }
                        : event;
                });
                const eventWithoutId = enrollmentToUpdate.events.find(event => event.uid);
                const eventsToUpdateAndAdd = eventWithoutId ?
                    [...eventsToUpdate, { ...eventWithoutId, pendingApiResponse: true }] : eventsToUpdate;

                return {
                    ...state,
                    enrollment: { ...state.enrollment, ...enrollmentToUpdate, events: eventsToUpdateAndAdd },
                };
            }

            return { ...state, enrollment: { ...state.enrollment, ...enrollmentToUpdate } };
        },
        [ROLLBACK_ENROLLMENT_AND_EVENTS]: (state, { payload: { uid } }) => {
            const enrollment = state.enrollment.dataToRollback;
            const events = state.enrollment.events.reduce((acc, event) => {
                if (uid && event.uid === uid) {
                    return acc;
                }
                const eventToRollback = event.dataToRollback ? event.dataToRollback : event;
                return [...acc, eventToRollback];
            }, []);

            return { ...state, enrollment: { ...state.enrollment, ...enrollment, events } };
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
        [enrollmentEditEventActionTypes.ASSIGNEE_SET]: setAssignee,
        [enrollmentEditEventActionTypes.ASSIGNEE_SAVE_FAILED]: setAssignee,
    },
    'enrollmentDomain',
    initialReducerValue,
);
