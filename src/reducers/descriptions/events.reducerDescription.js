// @flow
import { createReducerDescription } from 'capture-core/tracker-redux/trackerReducer';
import { actionTypes } from '../../init/enrollment.actions';

export const eventsDesc = createReducerDescription({
    [actionTypes.ENROLLMENT_LOADED]: (state, action) => {
        const eventContainers = action.payload;
        if (!eventContainers || eventContainers.length === 0) {
            return state;
        }

        const newEventsById = eventContainers.reduce((accEventsById, eventContainer) => {
            accEventsById[eventContainer.id] = eventContainer.event;
            return accEventsById;
        }, {});

        const newState = { ...state, ...newEventsById };
        return newState;
    },
}, 'events');

export const eventsValuesDesc = createReducerDescription({
    [actionTypes.ENROLLMENT_LOADED]: (state, action) => {
        const eventContainers = action.payload;
        if (!eventContainers || eventContainers.length === 0) {
            return state;
        }

        const newEventsValuesById = eventContainers.reduce((accEventsValuesById, eventContainer) => {
            accEventsValuesById[eventContainer.id] = eventContainer.values;
            return accEventsValuesById;
        }, {});

        const newState = { ...state, ...newEventsValuesById };
        return newState;
    },
}, 'eventsValues');
