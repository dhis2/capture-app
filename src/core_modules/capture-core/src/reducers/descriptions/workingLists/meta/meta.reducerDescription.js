// @flow
import { createReducerDescription } from '../../../../trackerRedux/trackerReducer';
import { actionTypes as eventsListActionTypes } from '../../../../components/Pages/MainPage/EventsList/eventsList.actions';
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

import { handleChooseWorkingList } from './chooseWorkingList.actionHandler';


export const workingListsMetaDesc = createReducerDescription({
    [eventsListActionTypes.SET_CURRENT_WORKING_LIST_CONFIG]: handleChooseWorkingList,
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        const listId = payload.listId;

        const oldData = newState[listId];
        const newData = newState[listId] && newState[listId].next;

        const filtersWithNull = {
            ...(oldData ? oldData.filters : null),
            ...(newData ? newData.filters : null),
        };

        const filtersWithoutNull = Object
            .keys(filtersWithNull)
            .reduce((accFilters, key) => {
                if (filtersWithNull[key]) {
                    accFilters[key] = filtersWithNull[key];
                }
                return accFilters;
            }, {});

        newState[listId] = {
            ...oldData,
            ...newData,
            ...payload.argsWithDefaults,
            ...payload.pagingData,
            filters: filtersWithoutNull,
            next: {},
        };

        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED]: (state, action) => {
        const listId = action.payload.listId;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                next: {},
            },
        };
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: (state, action) => {
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
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED]: (state, action) => {
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
        const listId = payload.listId;
        newState[listId] = {
            ...newState[listId],
            next: {
                ...newState[listId].next,
                filters: {
                    ...(newState[listId].next ? newState[listId].next.filters : null),
                    [payload.itemId]: payload.requestData,
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
