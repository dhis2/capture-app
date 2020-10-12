// @flow
import { createReducerDescription } from '../../../../trackerRedux/trackerReducer';
import { workingListsCommonActionTypes } from '../../../../components/Pages/MainPage/WorkingListsCommon';
import { eventWorkingListsActionTypes } from '../../../../components/Pages/MainPage/EventWorkingLists';
import { recentlyAddedEventsActionTypes } from '../../../../components/Pages/NewEvent/RecentlyAddedEventsList';

export const workingListsMetaDesc = createReducerDescription({
    [eventWorkingListsActionTypes.LIST_VIEW_INIT]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
    [eventWorkingListsActionTypes.LIST_VIEW_INIT_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const { listId, config, pagingData } = action.payload;
        const {
            filters,
            rowsPerPage,
            currentPage,
            sortById,
            sortByDirection,
            customColumnOrder,
        } = config;

        const initial = {
            filters,
            sortById,
            sortByDirection,
            visibleCustomColumnIds: customColumnOrder && customColumnOrder
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
    [eventWorkingListsActionTypes.LIST_UPDATE_SUCCESS]: (state, action) => {
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
    [eventWorkingListsActionTypes.LIST_UPDATE_ERROR]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = {
            ...newState[listId],
            next: {},
        };
        return newState;
    },
    [eventWorkingListsActionTypes.TEMPLATE_UPDATE]: (state, action) => {
        const { visibleColumnIds, filters, sortById, sortByDirection, listId } = action.payload;

        const nextInitial = {
            filters,
            sortById,
            sortByDirection,
            visibleColumnIds,
        };

        return {
            ...state,
            [listId]: {
                ...state[listId],
                nextInitial,
            },
        };
    },
    [eventWorkingListsActionTypes.TEMPLATE_UPDATE_SUCCESS]: (state, action) => {
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
    [eventWorkingListsActionTypes.TEMPLATE_UPDATE_ERROR]: (state, action) => {
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
    [eventWorkingListsActionTypes.TEMPLATE_ADD]: (state, action) => {
        const { visibleColumnIds, filters, sortById, sortByDirection, listId } = action.payload;

        const nextInitial = {
            filters,
            sortById,
            sortByDirection,
            visibleColumnIds,
        };

        return {
            ...state,
            [listId]: {
                ...state[listId],
                nextInitial,
            },
        };
    },
    [eventWorkingListsActionTypes.TEMPLATE_ADD_SUCCESS]: (state, action) => {
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
    [eventWorkingListsActionTypes.TEMPLATE_ADD_ERROR]: (state, action) => {
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
    [workingListsCommonActionTypes.PAGE_CHANGE]: (state, action) => {
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
    [workingListsCommonActionTypes.LIST_SORT]: (state, action) => {
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
    [workingListsCommonActionTypes.ROWS_PER_PAGE_CHANGE]: (state, action) => {
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
    [workingListsCommonActionTypes.FILTER_SET]: (state, action) => {
        const { filter, listId, itemId } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                next: {
                    ...state[listId].next,
                    filters: {
                        ...(state[listId].next && state[listId].next.filters),
                        [itemId]: filter,
                    },
                    currentPage: 1,
                },
            },
        };
    },
    [workingListsCommonActionTypes.FILTER_CLEAR]: (state, action) => {
        const { itemId, listId } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                next: {
                    ...state[listId].next,
                    filters: {
                        ...(state[listId].next && state[listId].next.filters),
                        [itemId]: null,
                    },
                    currentPage: 1,
                },
            },
        };
    },
    [recentlyAddedEventsActionTypes.LIST_RESET]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.listId] = action.payload.meta;
        return newState;
    },
}, 'workingListsMeta');
