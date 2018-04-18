// @flow
import { optimistic } from 'redux-optimistic-ui';
import { createReducerDescription } from '../../trackerRedux/trackerReducer';

import { actionTypes as dataEntryActionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
import { actionTypes as mainSelectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';
import { actionTypes as enrollmentActionTypes } from '../../actions/__TEMP__/enrollment.actions';

export const eventsDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const eventContainers = action.payload.eventContainers;
        if (!eventContainers || eventContainers.length === 0) {
            return {};
        }

        const newEventsById = eventContainers.reduce((accEventsById, eventContainer) => {
            accEventsById[eventContainer.id] = eventContainer.event;
            return accEventsById;
        }, {});

        const newState = { ...newEventsById };
        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED]: (state, action) => ({}),
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
}, 'events', {}, optimistic);

export const eventsValuesDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const eventContainers = action.payload.eventContainers;
        if (!eventContainers || eventContainers.length === 0) {
            return {};
        }

        const newEventsValuesById = eventContainers.reduce((accEventsValuesById, eventContainer) => {
            accEventsValuesById[eventContainer.id] = eventContainer.values;
            return accEventsValuesById;
        }, {});

        const newState = { ...newEventsValuesById };
        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED]: (state, action) => ({}),
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
}, 'eventsValues', {}, optimistic);
