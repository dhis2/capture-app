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
        };

        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const rowsCount = action.payload.pagingData.rowsCount;
        newState.main = { ...newState.main, rowsCount };
        return newState;
    },
    [paginationActionTypes.CHANGE_PAGE]: (state, action) => {
        const newState = { ...state };
        const page = action.payload;
        newState.main = { ...newState.main, currentPage: page };
        return newState;
    },
    [eventsListActionTypes.SORT_WORKING_LIST]: (state, action) => {
        const newState = { ...state };
        const { id, direction } = action.payload;
        newState.main = { ...newState.main, sortById: id, sortByDirection: direction, currentPage: 1 };
        return newState;
    },
    [paginationActionTypes.CHANGE_ROWS_PER_PAGE]: (state, action) => {
        const newState = { ...state };
        const rowsPerPage = action.payload;
        newState.main = { ...newState.main, rowsPerPage, currentPage: 1 };
        return newState;
    },
}, 'workingListsMeta');

export const workingListsUIDesc = createReducerDescription({
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS]: (state) => {
        const newState = { ...state };
        newState.main = {
            isLoading: true,
        };
        return newState;
    },
    [mainSelectionsActionTypes.VALID_SELECTIONS_FROM_URL]: (state) => {
        const newState = { ...state };
        newState.main = {
            isLoading: true,
        };
        return newState;
    },
    [paginationActionTypes.CHANGE_PAGE]: (state) => {
        const newState = { ...state };

        newState.main = {
            ...newState.main,
            isLoading: true,
        };

        return newState;
    },
    [paginationActionTypes.CHANGE_ROWS_PER_PAGE]: (state) => {
        const newState = { ...state };

        newState.main = {
            ...newState.main,
            isLoading: true,
        };

        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            isLoading: false,
            hasBeenLoaded: true,
        };
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            isLoading: false,
        };
        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED]: (state, action) => {
        const newState = { ...state };
        newState.main = {
            dataLoadingError: action.payload,
        };
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED]: (state, action) => {
        const newState = { ...state };
        newState.main = {
            dataLoadingError: action.payload,
        };
        return newState;
    },
    [newEventDataEntryActionTypes.START_SAVE_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            isLoading: true,
        };
        return newState;
    },
    [newEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE]: (state) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            isLoading: true,
        };
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
}, 'workingListsUI');

export const workingListsColumnsOrderDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        newState.main = action.payload.columnsOrder;
        return newState;
    },
}, 'workingListsColumnsOrder');

