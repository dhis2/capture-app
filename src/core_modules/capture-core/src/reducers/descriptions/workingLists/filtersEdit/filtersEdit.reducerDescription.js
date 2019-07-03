// @flow
import { createReducerDescription } from '../../../../trackerRedux/trackerReducer';
import {
    actionTypes as filterSelectorActionTypes,
} from '../../../../components/Pages/MainPage/EventsList/FilterSelectors/filterSelector.actions';
import {
    actionTypes as eventsListActionTypes,
} from '../../../../components/Pages/MainPage/EventsList/eventsList.actions';
import {
    actionTypes as quickSelectorActionTypes,
} from '../../../../components/QuickSelector/actions/QuickSelector.actions';
import {
    actionTypes as mainSelectionsActionTypes,
} from '../../../../components/Pages/MainPage/mainSelections.actions';
import {
    actionTypes as editEventSelectorActionTypes,
} from '../../../../components/Pages/EditEvent/editEvent.actions';
import {
    actionTypes as viewEventActionTypes,
} from '../../../../components/Pages/ViewEvent/viewEvent.actions';
import { handleChooseWorkingList } from './chooseWorkingList.actionHandler';

const updateFiltersEditOnUrlUpdate = (state, action) => {
    const payload = action.payload;
    const nextProgramId = payload.nextProps.programId;
    const prevProgramId = payload.prevProps.programId;
    if (nextProgramId !== prevProgramId) {
        return {
            ...state,
            main: {},
        };
    }
    return state;
};

export const workingListFiltersEditDesc = createReducerDescription({
    [filterSelectorActionTypes.EDIT_CONTENTS]: (state, action) => {
        const { itemId, listId, value } = action.payload;
        const newState = { ...state };
        newState[listId] = {
            ...newState[listId],
            next: {
                ...(newState[listId] ? newState[listId].next : null),
                [itemId]: value,
            },
        };
        return newState;
    },
    [filterSelectorActionTypes.CLEAR_FILTER]: (state, action) => {
        const { itemId, listId } = action.payload;
        const newState = { ...state };
        newState[listId] = {
            ...newState[listId],
            [itemId]: null,
            next: {},
        };
        return newState;
    },
    [filterSelectorActionTypes.SET_FILTER]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = {
            ...newState[listId],
            ...(newState[listId] ? newState[listId].next : null),
            next: {},
        };
        return newState;
    },
    [eventsListActionTypes.SET_CURRENT_WORKING_LIST_CONFIG]: handleChooseWorkingList,
    [filterSelectorActionTypes.REVERT_FILTER]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = {
            ...newState[listId],
            next: {},
        };
        return newState;
    },
    // Reason about this!!
    [quickSelectorActionTypes.RESET_PROGRAM_ID_BASE]: state => ({
        ...state,
        main: {},
    }),
    // Reason about this!!
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: updateFiltersEditOnUrlUpdate,
    // Reason about this!!
    [editEventSelectorActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const payload = action.payload;
        const nextProgramId = payload.eventContainer.event.programId;
        const prevProgramId = payload.prevProgramId;
        if (nextProgramId !== prevProgramId) {
            return {
                ...state,
                main: {},
            };
        }
        return state;
    },
    // Reason about this!!
    [viewEventActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const payload = action.payload;
        const nextProgramId = payload.eventContainer.event.programId;
        const prevProgramId = payload.prevProgramId;
        if (nextProgramId !== prevProgramId) {
            return {
                ...state,
                main: {},
            };
        }
        return state;
    },
}, 'workingListFiltersEdit');
