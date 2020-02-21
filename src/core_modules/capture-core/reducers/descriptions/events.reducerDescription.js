// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';

import { actionTypes as dataEntryActionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
import { actionTypes as enrollmentActionTypes } from '../../actions/__TEMP__/enrollment.actions';
import { actionTypes as editEventActionTypes } from '../../components/Pages/EditEvent/editEvent.actions';
import { actionTypes as viewEventActionTypes } from '../../components/Pages/ViewEvent/viewEvent.actions';
import { actionTypes as workingListsActionTypes } from '../../components/Pages/MainPage/WorkingLists';

const getFromWorkingListRetrieval = (eventContainers, containerProperty) => {
    if (!eventContainers || eventContainers.length === 0) {
        return {};
    }

    const byId = eventContainers.reduce((accById, eventContainer) => {
        accById[eventContainer.id] = eventContainer[containerProperty];
        return accById;
    }, {});

    return byId;
};

export const eventsDesc = createReducerDescription({
    [workingListsActionTypes.EVENT_LIST_INIT_SUCCESS]: (state, action) => {
        const eventContainers = action.payload.eventContainers;
        const newEventsById = getFromWorkingListRetrieval(eventContainers, 'event');
        const newState = { ...newEventsById };
        return newState;
    },
    [workingListsActionTypes.EVENT_LIST_UPDATE_SUCCESS]: (state, action) => {
        const eventContainers = action.payload.eventContainers;
        const newEventsById = getFromWorkingListRetrieval(eventContainers, 'event');
        const newState = { ...newEventsById };
        return newState;
    },
    [enrollmentActionTypes.ENROLLMENT_LOADED]: (state, action) => {
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
    [dataEntryActionTypes.SAVE_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.eventId] = payload.event;
        return newState;
    },
    [dataEntryActionTypes.COMPLETE_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.eventId] = payload.event;
        return newState;
    },
    [editEventActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const event = action.payload.eventContainer.event;
        const newState = {
            ...state,
            [event.eventId]: event,
        };
        return newState;
    },
    [viewEventActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const event = action.payload.eventContainer.event;
        const newState = {
            ...state,
            [event.eventId]: event,
        };
        return newState;
    },
    [viewEventActionTypes.ADD_EVENT_NOTE]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        if (newState && newState[payload.eventId]) {
            newState[payload.eventId].notes = [...state[payload.eventId].notes, payload.note];
        }
        return newState;
    },
    [viewEventActionTypes.REMOVE_EVENT_NOTE]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        if (newState && newState[payload.eventId]) {
            newState[payload.eventId].notes = state[payload.eventId].notes.filter(n => n.clientId !== payload.noteClientId);
        }
        return newState;
    },

}, 'events', {});

export const eventsValuesDesc = createReducerDescription({
    [workingListsActionTypes.EVENT_LIST_INIT_SUCCESS]: (state, action) => {
        const eventContainers = action.payload.eventContainers;
        const newEventsValuesById = getFromWorkingListRetrieval(eventContainers, 'values');
        const newState = { ...newEventsValuesById };
        return newState;
    },
    [workingListsActionTypes.EVENT_LIST_UPDATE_SUCCESS]: (state, action) => {
        const eventContainers = action.payload.eventContainers;
        const newEventsValuesById = getFromWorkingListRetrieval(eventContainers, 'values');
        const newState = { ...newEventsValuesById };
        return newState;
    },
    [enrollmentActionTypes.ENROLLMENT_LOADED]: (state, action) => {
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
    [dataEntryActionTypes.COMPLETE_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.eventId] = action.payload.clientValues;
        return newState;
    },
    [dataEntryActionTypes.SAVE_EVENT]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.eventId] = action.payload.clientValues;
        return newState;
    },
}, 'eventsValues', {});
