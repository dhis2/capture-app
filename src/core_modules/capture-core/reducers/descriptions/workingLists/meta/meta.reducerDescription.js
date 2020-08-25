// @flow
import { createReducerDescription } from '../../../../trackerRedux/trackerReducer';
import {
    actionTypes as eventsListActionTypes,
} from '../../../../components/Pages/MainPage/EventsList/eventsList.actions';
import {
    actionTypes as paginationActionTypes,
} from '../../../../components/Pages/MainPage/EventsList/Pagination/pagination.actions';
import {
    actionTypes as listActionTypes,
} from '../../../../components/List/list.actions';
import { actionTypes as workingListsActionTypes } from '../../../../components/Pages/MainPage/WorkingLists';

export const workingListsMetaDesc = createReducerDescription({
    [workingListsActionTypes.EVENT_LIST_INIT]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
    [workingListsActionTypes.EVENT_LIST_INIT_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const { listId, config, pagingData } = action.payload;
        const {
            filters,
            rowsPerPage,
            currentPage,
            sortById,
            sortByDirection,
            columnOrder,
        } = config;

        const initial = {
            filters,
            sortById,
            sortByDirection,
            columnDisplayOrder: columnOrder
                .map(spec => (spec.visible ? spec.id : null))
                .filter(columnId => columnId),
        };

        const listState = {
            filters,
            rowsPerPage,
            currentPage,
            sortById,
            sortByDirection,
            ...pagingData,
            initial,
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
    [workingListsActionTypes.TEMPLATE_UPDATE]: (state, action) => {
        const { columnOrder, filters, sortById, sortByDirection, listId } = action.payload;

        const nextInitial = {
            filters,
            sortById,
            sortByDirection,
            columnDisplayOrder: columnOrder
                .map(spec => (spec.visible ? spec.id : null))
                .filter(columnId => columnId),
        };

        return {
            ...state,
            [listId]: {
                ...state[listId],
                nextInitial,
            },
        };
    },
    [workingListsActionTypes.TEMPLATE_UPDATE_SUCCESS]: (state, action) => {
        const { isActiveTemplate, listId } = action.payload;

        if (!isActiveTemplate) {
            return state;
        }

        return {
            ...state,
            [listId]: {
                ...state[listId],
                initial: state[listId].nextInitial,
                nextInitial: undefined,
            },
        };
    },
    [workingListsActionTypes.TEMPLATE_UPDATE_ERROR]: (state, action) => {
        const { isActiveTemplate, listId } = action.payload;

        if (!isActiveTemplate) {
            return state;
        }

        return {
            ...state,
            [listId]: {
                ...state[listId],
                nextInitial: undefined,
            },
        };
    },
    [workingListsActionTypes.TEMPLATE_ADD]: (state, action) => {
        const { columnOrder, filters, sortById, sortByDirection, listId } = action.payload;

        const nextInitial = {
            filters,
            sortById,
            sortByDirection,
            columnDisplayOrder: columnOrder
                .map(spec => (spec.visible ? spec.id : null))
                .filter(columnId => columnId),
        };

        return {
            ...state,
            [listId]: {
                ...state[listId],
                nextInitial,
            },
        };
    },
    [workingListsActionTypes.TEMPLATE_ADD_SUCCESS]: (state, action) => {
        const { isActiveTemplate, listId } = action.payload;

        if (!isActiveTemplate) {
            return state;
        }

        return {
            ...state,
            [listId]: {
                ...state[listId],
                initial: state[listId].nextInitial,
                nextInitial: undefined,
            },
        };
    },
    [workingListsActionTypes.TEMPLATE_ADD_ERROR]: (state, action) => {
        const { isActiveTemplate, listId } = action.payload;

        if (!isActiveTemplate) {
            return state;
        }

        return {
            ...state,
            [listId]: {
                ...state[listId],
                nextInitial: undefined,
            },
        };
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
    [listActionTypes.RESET_LIST]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.listId] = action.payload.meta;
        return newState;
    },
}, 'workingListsMeta');
