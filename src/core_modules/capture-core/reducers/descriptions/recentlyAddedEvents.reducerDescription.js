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
        const { event, programId } = action.payload;
        newState[event.eventId] = event;
        newState.meta = {
            programId,
        };
        return newState;
    },
    [recentlyAddedEventsActionTypes.LIST_RESET]: (state, action) => {
        const { listId: actionListId, selections: { programId } } = action.payload;
        const storedProgramId = state.meta && state.meta.programId;
        if (storedProgramId === programId) {
            return state;
        }
        if (actionListId === listId) {
            const newState = {};
            return newState;
        }
        return state;
    },
    EditEventDataEntrySavedForViewSingleEvent: (state, action) => {
        const { listData: { clientEvent } } = action.meta;
        const { eventId } = clientEvent;
        return {
            ...state,
            [eventId]: clientEvent,
        };
    },
}, 'recentlyAddedEvents', {});

export const recentlyAddedEventsValuesDesc = createReducerDescription({
    [recentlyAddedEventsActionTypes.NEW_RECENTLY_ADDED_EVENT]: (state, action) => {
        const newState = { ...state };
        const { eventValues, event: { eventId }, programId } = action.payload;
        newState[eventId] = eventValues;
        newState.meta = {
            programId,
        };
        return newState;
    },

    [recentlyAddedEventsActionTypes.LIST_RESET]: (state, action) => {
        const { listId: actionListId, selections: { programId } } = action.payload;
        const storedProgramId = state.meta && state.meta.programId;
        if (storedProgramId === programId) {
            return state;
        }
        if (actionListId === listId) {
            const newState = {};
            return newState;
        }
        return state;
    },
    EditEventDataEntrySavedForViewSingleEvent: (state, action) => {
        const { listData: { clientEvent: { eventId }, clientEventValues } } = action.meta;
        return {
            ...state,
            [eventId]: clientEventValues,
        };
    },
}, 'recentlyAddedEventsValues', {});
