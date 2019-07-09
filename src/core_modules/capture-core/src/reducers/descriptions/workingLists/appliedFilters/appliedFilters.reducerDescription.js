// @flow
import { createReducerDescription } from '../../../../trackerRedux/trackerReducer';
import {
    actionTypes as eventsListActionTypes,
} from '../../../../components/Pages/MainPage/EventsList/eventsList.actions';
import { actionTypes as mainSelectionsActionTypes } from '../../../../components/Pages/MainPage/mainSelections.actions';
import {
    actionTypes as filterSelectorActionTypes,
} from '../../../../components/Pages/MainPage/EventsList/FilterSelectors/filterSelector.actions';

export const workingListsAppliedFiltersDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const { listId, config } = action.payload;
       
        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED]: (state, action) => {
        const newState = {
            ...state,
            [action.payload.listId]: {},
        };
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        const next = newState[listId].next;
        newState[listId] = {
            ...newState[listId],
            ...next,
            next: {},
        };
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = {
            ...newState[listId],
            next: {},
        };
        return newState;
    },
    [filterSelectorActionTypes.SET_FILTER]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const listId = payload.listId;
        newState[listId] = {
            ...newState[listId],
            next: {
                ...(newState[listId] ? newState[listId].next : null),
                [payload.itemId]: payload.appliedText,
            },
        };
        return newState;
    },
    [filterSelectorActionTypes.CLEAR_FILTER]: (state, action) => {
        const newState = { ...state };
        const { itemId, listId } = action.payload;
        newState[listId] = {
            ...newState[listId],
            next: {
                ...(newState[listId] ? newState[listId].next : null),
                [itemId]: null,
            },
        };
        return newState;
    },
}, 'workingListsAppliedFilters');
