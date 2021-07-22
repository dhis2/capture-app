// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { enrollmentActionTypes } from '../../components/Pages/actions/enrollment.actions';

const initialReducerValue = {};
const {
    SET_ENROLLMENT,
    UPDATE_ENROLLMENT_EVENTS,
    ROLLBACK_ENROLLMENT_EVENT,
    COMMIT_ENROLLMENT_EVENT,
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
            const events = state.events.map(event =>
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
            const events = state.events.map(event =>
                (event.event === eventId ? event.dataToRollback : event),
            );

            return { ...state, events };
        },
        [COMMIT_ENROLLMENT_EVENT]: (state, { payload: { eventId } }) => {
            const events = state.events.map((event) => {
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
    },
    'enrollmentSite',
    initialReducerValue,
);
