// @flow

import { createReducerDescription } from '../../trackerRedux/trackerReducer';

import {
    actionTypes as recentlyAddedEventsListActions,
} from '../../components/Pages/NewEvent/RecentlyAddedEventsList/recentlyAddedEventsList.actions';

import {
    actionTypes as listActionTypes,
} from '../../components/List/list.actions';

import {
    listId,
} from '../../components/Pages/NewEvent/RecentlyAddedEventsList/RecentlyAddedEventsList.const';


export const recentlyAddedEventsDesc = createReducerDescription({
    [recentlyAddedEventsListActions.NEW_RECENTLY_ADDED_EVENT]: (state, action) => {
        const newState = { ...state };
        const event = action.payload.event;
        newState[event.eventId] = event;
        return newState;
    },
    [listActionTypes.RESET_LIST]: (state, action) => {
        const actionListId = action.payload.listId;
        if (actionListId === listId) {
            const newState = {};
            return newState;
        }
        return state;
    },
}, 'recentlyAddedEvents', {});

export const recentlyAddedEventsValuesDesc = createReducerDescription({
    [recentlyAddedEventsListActions.NEW_RECENTLY_ADDED_EVENT]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.event.eventId] = action.payload.eventValues;
        return newState;
    },

    [listActionTypes.RESET_LIST]: (state, action) => {
        const actionListId = action.payload.listId;
        if (actionListId === listId) {
            const newState = {};
            return newState;
        }
        return state;
    },

}, 'recentlyAddedEventsValues', {});
