// @flow
import { createReducerDescription } from '../../../../trackerRedux/trackerReducer';
import {
    actionTypes as eventsListActionTypes,
} from '../../../../components/Pages/MainPage/EventsList/eventsList.actions';
import { actionTypes as mainSelectionsActionTypes } from '../../../../components/Pages/MainPage/mainSelections.actions';
import {
    actionTypes as paginationActionTypes,
} from '../../../../components/Pages/MainPage/EventsList/Pagination/pagination.actions';
import {
    actionTypes as filterSelectorActionTypes,
} from '../../../../components/Pages/MainPage/EventsList/FilterSelectors/filterSelector.actions';
import {
    actionTypes as listActionTypes,
} from '../../../../components/List/list.actions';
import { actionTypes as workingListsActionTypes } from '../../../../components/Pages/MainPage/WorkingLists';

export const workingListsMetaDesc = createReducerDescription({
    [workingListsActionTypes.DATA_PRE_CLEAN]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
    [workingListsActionTypes.EVENT_LIST_INIT_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const { listId, queryData, pagingData } = action.payload;

        const listState = {
            ...queryData,
            ...pagingData,
            next: {},
        };

        newState[listId] = listState;
        return newState;
    },
    [workingListsActionTypes.EVENT_LIST_UPDATE_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const { listId, pagingData } = action.payload;
        const next = newState[listId].next;
        newState[listId] = {
            ...newState[listId],
            ...next,
            ...pagingData,
            filters: {
                ...newState[listId].filters,
                ...newState[listId].next.filters,
            },
            next: {},
        };
        return newState;
    },
    [workingListsActionTypes.EVENT_LIST_UPDATE_ERROR]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = {
            ...newState[listId],
            next: {},
        };
        return newState;
    },
    [paginationActionTypes.CHANGE_PAGE]: (state, action) => {
        const newState = { ...state };
        const { pageNumber, listId } = action.payload;
        newState[listId] = {
            ...newState[listId],
            next: {
                ...newState[listId].next,
                currentPage: pageNumber,
            },
        };
        return newState;
    },
    [eventsListActionTypes.SORT_WORKING_LIST]: (state, action) => {
        const newState = { ...state };
        const { listId, id, direction } = action.payload;
        newState[listId] = {
            ...newState[listId],
            next: {
                ...newState[listId].next,
                sortById: id,
                sortByDirection: direction,
                currentPage: 1,
            },
        };
        return newState;
    },
    [paginationActionTypes.CHANGE_ROWS_PER_PAGE]: (state, action) => {
        const newState = { ...state };
        const { rowsPerPage, listId } = action.payload;
        newState[listId] = {
            ...newState[listId],
            next: {
                ...newState[listId].next,
                rowsPerPage,
                currentPage: 1,
            },
        };
        return newState;
    },
    [filterSelectorActionTypes.SET_FILTER]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const { listId, itemId } = action.meta;
        newState[listId] = {
            ...newState[listId],
            next: {
                ...newState[listId].next,
                filters: {
                    ...(newState[listId].next ? newState[listId].next.filters : null),
                    [itemId]: payload,
                },
            },
        };
        return newState;
    },
    [filterSelectorActionTypes.CLEAR_FILTER]: (state, action) => {
        const newState = { ...state };
        const { itemId, listId } = action.payload;

        const nextMainStateFilters = {
            ...(newState[listId].next ? newState[listId].next.filters : null),
            [itemId]: null,
        };

        newState[listId] = {
            ...newState[listId],
            next: {
                ...newState[listId].next,
                filters: nextMainStateFilters,
            },
        };

        return newState;
    },
    [listActionTypes.RESET_LIST]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.listId] = action.payload.meta;
        return newState;
    },
}, 'workingListsMeta');
