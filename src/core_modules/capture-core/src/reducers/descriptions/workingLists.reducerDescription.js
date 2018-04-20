// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as mainSelectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';
import { actionTypes as paginationActionTypes } from '../../components/Pages/MainPage/EventsList/Pagination/pagination.actions';
import { actionTypes as eventsListActionTypes } from '../../components/Pages/MainPage/EventsList/eventsList.actions';

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

        // newState.main = action.payload.pagingData;
       
        newState.main = {
            rowsPerPage: 1,
            rowsCount: 3,
            currentPage: 1,
        };

        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        // const rowsCount = action.payload.rowsCount;
        const rowsCount = 3;
        newState.main = { ...newState.main, rowsCount };
        return newState;
    },
    [paginationActionTypes.CHANGE_PAGE]: (state, action) => {
        const newState = { ...state };
        const page = action.payload;
        newState.main = { ...newState.main, currentPage: page };
        return newState;
    },
    [paginationActionTypes.CHANGE_ROWS_PER_PAGE]: (state, action) => {
        const newState = { ...state };
        const rowsPerPage = action.payload;
        newState.main = { ...newState.main, rowsPerPage };
        return newState;
    },
}, 'workingListsMeta');

export const workingListsUIDesc = createReducerDescription({
    [mainSelectionsActionTypes.MAIN_SELECTIONS_COMPLETED]: (state, action) => {
        const newState = { ...state };
        newState.main = {
            isLoading: true,
        };
        return newState;
    },
    [paginationActionTypes.CHANGE_PAGE]: (state, action) => {
        const newState = { ...state };

        newState.main = {
            ...newState.main,
            isLoading: true,
        };

        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        newState.main = {
            ...newState.main,
            isLoading: false,
        };
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: (state, action) => {
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
}, 'workingListsUI');

