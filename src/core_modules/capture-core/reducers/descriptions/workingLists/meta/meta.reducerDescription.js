// @flow
import { createReducerDescription } from '../../../../trackerRedux/trackerReducer';
import { workingListsCommonActionTypes } from '../../../../components/Pages/MainPage/WorkingListsCommon';
import { recentlyAddedEventsActionTypes } from '../../../../components/Pages/NewEvent/RecentlyAddedEventsList';

export const workingListsMetaDesc = createReducerDescription({
    [workingListsCommonActionTypes.LIST_VIEW_INIT]: (state, action) => {
        const { storeId } = action.payload;
        return {
            ...state,
            [storeId]: undefined,
        };
    },
    [workingListsCommonActionTypes.LIST_VIEW_INIT_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const { storeId, config, pagingData } = action.payload;
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
            customVisibleColumnIds: customColumnOrder && customColumnOrder
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
        newState[storeId] = listState;

        return newState;
    },
    [workingListsCommonActionTypes.LIST_UPDATE_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const { storeId, pagingData } = action.payload;
        const next = newState[storeId].next;
        newState[storeId] = {
            ...newState[storeId],
            ...next,
            ...pagingData,
            filters: {
                ...newState[storeId].filters,
                ...newState[storeId].next.filters,
            },
            next: {},
        };
        return newState;
    },
    [workingListsCommonActionTypes.LIST_UPDATE_ERROR]: (state, action) => {
        const newState = { ...state };
        const storeId = action.payload.storeId;
        newState[storeId] = {
            ...newState[storeId],
            next: {},
        };
        return newState;
    },
    [workingListsCommonActionTypes.TEMPLATE_UPDATE]: (state, action) => {
        const { visibleColumnIds, filters, sortById, sortByDirection, storeId } = action.payload;

        const nextInitial = {
            filters,
            sortById,
            sortByDirection,
            customVisibleColumnIds: visibleColumnIds,
        };

        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                nextInitial,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_UPDATE_SUCCESS]: (state, action) => {
        const { isActiveTemplate, storeId } = action.payload;

        if (!isActiveTemplate) {
            return state;
        }

        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                initial: state[storeId].nextInitial,
                nextInitial: undefined,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_UPDATE_ERROR]: (state, action) => {
        const { isActiveTemplate, storeId } = action.payload;

        if (!isActiveTemplate) {
            return state;
        }

        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                nextInitial: undefined,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_ADD]: (state, action) => {
        const { visibleColumnIds, filters, sortById, sortByDirection, storeId } = action.payload;

        const nextInitial = {
            filters,
            sortById,
            sortByDirection,
            customVisibleColumnIds: visibleColumnIds,
        };

        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                nextInitial,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_ADD_SUCCESS]: (state, action) => {
        const { isActiveTemplate, storeId } = action.payload;

        if (!isActiveTemplate) {
            return state;
        }

        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                initial: state[storeId].nextInitial,
                nextInitial: undefined,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_ADD_ERROR]: (state, action) => {
        const { isActiveTemplate, storeId } = action.payload;

        if (!isActiveTemplate) {
            return state;
        }

        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                nextInitial: undefined,
            },
        };
    },
    [workingListsCommonActionTypes.PAGE_CHANGE]: (state, action) => {
        const newState = { ...state };
        const { pageNumber, storeId } = action.payload;
        newState[storeId] = {
            ...newState[storeId],
            next: {
                ...newState[storeId].next,
                currentPage: pageNumber,
            },
        };
        return newState;
    },
    [workingListsCommonActionTypes.LIST_SORT]: (state, action) => {
        const newState = { ...state };
        const { storeId, id, direction } = action.payload;
        newState[storeId] = {
            ...newState[storeId],
            next: {
                ...newState[storeId].next,
                sortById: id,
                sortByDirection: direction,
                currentPage: 1,
            },
        };
        return newState;
    },
    [workingListsCommonActionTypes.ROWS_PER_PAGE_CHANGE]: (state, action) => {
        const newState = { ...state };
        const { rowsPerPage, storeId } = action.payload;
        newState[storeId] = {
            ...newState[storeId],
            next: {
                ...newState[storeId].next,
                rowsPerPage,
                currentPage: 1,
            },
        };
        return newState;
    },
    [workingListsCommonActionTypes.FILTER_SET]: (state, action) => {
        const { filter, storeId, itemId } = action.payload;
        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                next: {
                    ...state[storeId].next,
                    filters: {
                        ...(state[storeId].next && state[storeId].next.filters),
                        [itemId]: filter,
                    },
                    currentPage: 1,
                },
            },
        };
    },
    [workingListsCommonActionTypes.FILTER_CLEAR]: (state, action) => {
        const { itemId, storeId } = action.payload;
        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                next: {
                    ...state[storeId].next,
                    filters: {
                        ...(state[storeId].next && state[storeId].next.filters),
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
