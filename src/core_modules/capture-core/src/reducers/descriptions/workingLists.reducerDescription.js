// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as mainSelectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';
import {
    actionTypes as paginationActionTypes,
} from '../../components/Pages/MainPage/EventsList/Pagination/pagination.actions';
import { actionTypes as eventsListActionTypes } from '../../components/Pages/MainPage/EventsList/eventsList.actions';
import {
    actionTypes as newEventDataEntryActionTypes,
} from '../../components/Pages/NewEvent/DataEntry/newEventDataEntry.actions';
import {
    actionTypes as editEventDataEntryActionTypes,
} from '../../components/Pages/EditEvent/DataEntry/editEventDataEntry.actions';
import {
    actionTypes as connectivityActionTypes,
} from '../../components/Connectivity/connectivity.actions';
import {
    actionTypes as mainPageSelectorActionTypes,
} from '../../components/Pages/MainPage/MainPageSelector/MainPageSelector.actions';
import {
    actionTypes as columnSelectorActionTypes,
} from '../../components/ColumnSelector/actions/ColumnSelector.actions';
import {
    actionTypes as filterSelectorActionTypes,
} from '../../components/Pages/MainPage/EventsList/FilterSelectors/filterSelector.actions';

export const workingListsDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };

        const eventContainers = action.payload.eventContainers;
        newState.main = {
            order: eventContainers ?
                eventContainers
                    .map(container => container.event.eventId) : [],
            type: 'event',
        };

        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };

        const eventContainers = action.payload.eventContainers;
        newState.main = {
            order: eventContainers ?
                eventContainers
                    .map(container => container.event.eventId) : [],
            type: 'event',
        };

        return newState;
    },
}, 'workingLists');

export const workingListsMetaDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };

        newState.main = {
            ...action.payload.pagingData,
            sortById: 'eventDate',
            sortByDirection: 'desc',
            next: {},
        };

        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED]: (state) => {
        return {
            ...state,
            main: {},
        };
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const pagingData = action.payload.pagingData;
        const next = newState.main.next;
        newState.main = {
            ...newState.main,
            ...next,
            ...pagingData,
            filters: {
                ...newState.main.filters,
                ...newState.main.next.filters,
            },
            next: {},
        };
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            next: {},
        };
        return newState;
    },
    [paginationActionTypes.CHANGE_PAGE]: (state, action) => {
        const newState = { ...state };
        const page = action.payload;
        newState.main = {
            ...newState.main,
            next: {
                ...newState.main.next,
                currentPage: page,
            },
        };
        return newState;
    },
    [eventsListActionTypes.SORT_WORKING_LIST]: (state, action) => {
        const newState = { ...state };
        const { id, direction } = action.payload;
        newState.main = {
            ...newState.main,
            next: {
                ...newState.main.next,
                sortById: id,
                sortByDirection: direction,
                currentPage: 1,
            },
        };
        return newState;
    },
    [paginationActionTypes.CHANGE_ROWS_PER_PAGE]: (state, action) => {
        const newState = { ...state };
        const rowsPerPage = action.payload;
        newState.main = {
            ...newState.main,
            next: {
                ...newState.main.next,
                rowsPerPage,
                currentPage: 1,
            },
        };
        return newState;
    },
    [filterSelectorActionTypes.SET_FILTER]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState.main = {
            ...newState.main,
            next: {
                ...newState.main.next,
                filters: {
                    ...(newState.main.next ? newState.main.next.filters : null),
                    [payload.itemId]: payload.requestData,
                },
            },
        };
        return newState;
    },
    [filterSelectorActionTypes.CLEAR_FILTER]: (state, action) => {
        const newState = { ...state };
        const itemId = action.payload.itemId;

        const nextMainStateFilters = {
            ...(newState.main.next ? newState.main.next.filters : null),
            [itemId]: null,
        };

        newState.main = {
            ...newState.main,
            next: {
                ...newState.main.next,
                filters: nextMainStateFilters,
            },
        };

        return newState;
    },
}, 'workingListsMeta');

const getLoadingState = oldState => ({
    ...oldState,
    isLoading: true,
});

export const workingListsUIDesc = createReducerDescription({
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS]: (state) => {
        const newState = { ...state };
        newState.main = getLoadingState(newState.main);
        return newState;
    },
    [mainPageSelectorActionTypes.SET_ORG_UNIT]: (state) => {
        const newState = { ...state };
        newState.main = getLoadingState(newState.main);
        return newState;
    },
    [mainPageSelectorActionTypes.SET_PROGRAM_ID]: (state) => {
        const newState = { ...state };
        newState.main = getLoadingState(newState.main);
        return newState;
    },
    [mainPageSelectorActionTypes.SET_CATEGORY_OPTION]: (state) => {
        const newState = { ...state };
        newState.main = getLoadingState(newState.main);
        return newState;
    },
    [mainSelectionsActionTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.main = getLoadingState(newState.main);
        return newState;
    },
    [paginationActionTypes.CHANGE_PAGE]: (state) => {
        const newState = { ...state };
        newState.main = getLoadingState(newState.main);
        return newState;
    },
    [paginationActionTypes.CHANGE_ROWS_PER_PAGE]: (state) => {
        const newState = { ...state };
        newState.main = getLoadingState(newState.main);
        return newState;
    },
    [eventsListActionTypes.SORT_WORKING_LIST]: (state) => {
        const newState = { ...state };
        newState.main = getLoadingState(newState.main);
        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            isLoading: false,
            hasBeenLoaded: true,
            dataLoadingError: null,
        };
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            isLoading: false,
            dataLoadingError: null,
        };
        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED]: (state, action) => {
        const newState = { ...state };
        newState.main = {
            dataLoadingError: action.payload,
            isLoading: false,
        };
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED]: (state) => {
        const newState = { ...state };
        newState.main = {
            dataLoadingError: null,  // reverting list to previous state and showing feedbackBar message
            isLoading: false,
        };
        return newState;
    },
    [newEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.main = getLoadingState(newState.main);
        return newState;
    },
    [newEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.main = getLoadingState(newState.main);
        return newState;
    },
    [newEventDataEntryActionTypes.CANCEL_SAVE_NO_WORKING_LIST_UPDATE_NEEDED]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            isLoading: false,
        };
        return newState;
    },
    [newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_AFTER_RETURNED_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            isLoading: false,
        };
        return newState;
    },
    [editEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.main = getLoadingState(newState.main);
        return newState;
    },
    [editEventDataEntryActionTypes.EVENT_UPDATE_FAILED_AFTER_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            isLoading: false,
        };
        return newState;
    },
    [editEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.main = getLoadingState(newState.main);
        return newState;
    },
    [editEventDataEntryActionTypes.NO_WORKING_LIST_UPDATE_NEEDED_AFTER_CANCEL_UPDATE]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            isLoading: false,
        };
        return newState;
    },
    [connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT]: (state) => {
        const newState = { ...state };
        newState.main = getLoadingState(newState.main);
        return newState;
    },
}, 'workingListsUI');

export const workingListsColumnsOrderDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        newState.main = action.payload.columnsOrder;
        return newState;
    },
    [columnSelectorActionTypes.UPDATE_WORKINGLIST_ORDER]: (state, action) => {
        const newState = { ...state };
        newState.main = [...action.payload];
        return newState;
    },
}, 'workingListsColumnsOrder');

export const workingListsContextDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        newState.main = action.payload.selections;
        return newState;
    },
}, 'workingListsContext');

export const workingListFiltersEditDesc = createReducerDescription({
    [filterSelectorActionTypes.EDIT_CONTENTS]: (state, action) => {
        const payload = action.payload;
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            next: {
                ...(newState.main ? newState.main.next : null),
                [payload.itemId]: payload.value,
            },
        };
        return newState;
    },
    [filterSelectorActionTypes.CLEAR_FILTER]: (state, action) => {
        const itemId = action.payload.itemId;
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            [itemId]: null,
            next: {},
        };
        return newState;
    },
    [filterSelectorActionTypes.SET_FILTER]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            ...(newState.main ? newState.main.next : null),
            next: {},
        };
        return newState;
    },
    [filterSelectorActionTypes.REVERT_FILTER]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            next: {},
        };
        return newState;
    },
}, 'workingListFiltersEdit');

export const workingListsAppliedFiltersDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state) => {
        const newState = {
            ...state,
            main: {},
        };
        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED]: (state) => {
        const newState = {
            ...state,
            main: {},
        };
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: (state) => {
        const newState = { ...state };
        const next = newState.main.next;
        newState.main = {
            ...newState.main,
            ...next,
            next: {},
        };
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            next: {},
        };
        return newState;
    },
    [filterSelectorActionTypes.SET_FILTER]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState.main = {
            ...newState.main,
            next: {
                ...(newState.main ? newState.main.next : null),
                [payload.itemId]: payload.appliedText,
            },
        };
        return newState;
    },
    [filterSelectorActionTypes.CLEAR_FILTER]: (state, action) => {
        const newState = { ...state };
        const itemId = action.payload.itemId;
        newState.main = {
            ...newState.main,
            next: {
                ...(newState.main ? newState.main.next : null),
                [itemId]: null,
            },
        };
        return newState;
    },
}, 'workingListsAppliedFilters');
