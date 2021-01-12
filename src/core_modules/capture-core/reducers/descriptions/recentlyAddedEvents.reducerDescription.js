// @flow

import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import {
    recentlyAddedEventsActionTypes,
} from '../../components/DataEntries/SingleEventRegistrationEntry/DataEntryWrapper/RecentlyAddedEventsList';
import {
    listId,
} from '../../components/DataEntries/SingleEventRegistrationEntry/DataEntryWrapper/RecentlyAddedEventsList/RecentlyAddedEventsList.const';


export const recentlyAddedEventsDesc = createReducerDescription({
    [recentlyAddedEventsActionTypes.NEW_RECENTLY_ADDED_EVENT]: (state, action) => {
        const newState = { ...state };
        const event = action.payload.event;
        newState[event.eventId] = event;
        return newState;
    },
    [recentlyAddedEventsActionTypes.LIST_RESET]: (state, action) => {
        const actionListId = action.payload.listId;
        if (actionListId === listId) {
            const newState = {};
            return newState;
        }
        return state;
    },
}, 'recentlyAddedEvents', {});

export const recentlyAddedEventsValuesDesc = createReducerDescription({
    [recentlyAddedEventsActionTypes.NEW_RECENTLY_ADDED_EVENT]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.event.eventId] = action.payload.eventValues;
        return newState;
    },

    [recentlyAddedEventsActionTypes.LIST_RESET]: (state, action) => {
        const actionListId = action.payload.listId;
        if (actionListId === listId) {
            const newState = {};
            return newState;
        }
        return state;
    },

}, 'recentlyAddedEventsValues', {});
