// @flow
import { createReducerDescription } from '../../trackerRedux/trackerReducer';
import { actionTypes as mainSelectionsActionTypes } from '../../components/Pages/MainPage/mainSelections.actions';
import {
    actionTypes as paginationActionTypes,
} from '../../components/Pages/MainPage/EventsList/Pagination/pagination.actions';
import { actionTypes as eventsListActionTypes } from '../../components/Pages/MainPage/EventsList/eventsList.actions';
import {
    dataEntryActionTypes as newEventDataEntryActionTypes,
    selectorActionTypes as newEventSelectorActionTypes,
} from '../../components/Pages/NewEvent';
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
import {
    actionTypes as quickSelectorActionTypes,
} from '../../components/QuickSelector/actions/QuickSelector.actions';
import {
    actionTypes as editEventSelectorActionTypes,
} from '../../components/Pages/EditEvent/editEvent.actions';
import {
    actionTypes as viewEventActionTypes,
} from '../../components/Pages/ViewEvent/viewEvent.actions';
import {
    actionTypes as listActionTypes,
} from '../../components/List/list.actions';
import {
    actionTypes as cleanUpActionTypes,
} from '../../cleanUp/cleanUp.actions';

export const workingListsDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const { listId, eventContainers } = action.payload;
        newState[listId] = {
            order: eventContainers ?
                eventContainers
                    .map(container => container.event.eventId) : [],
            type: 'event',
        };
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const { listId, eventContainers } = action.payload;
        newState[listId] = {
            order: eventContainers ?
                eventContainers
                    .map(container => container.event.eventId) : [],
            type: 'event',
        };

        return newState;
    },
    [listActionTypes.APPEND_LIST_ITEM]: (state, action) => {
        const newState = { ...state };
        const { listId, itemId } = action.payload;
        newState[listId] = {
            order: [...(state[listId] ? state[listId].order : []), itemId],
        };
        return newState;
    },
    [listActionTypes.PREPEND_LIST_ITEM]: (state, action) => {
        const newState = { ...state };
        const { listId, itemId } = action.payload;
        newState[listId] = {
            order: [itemId, ...(state[listId] ? state[listId].order : [])],
        };
        return newState;
    },
    [listActionTypes.REMOVE_LIST_ITEM]: (state, action) => {
        const newState = { ...state };
        const { listId, itemId } = action.payload;
        newState[listId] = {
            order: state[listId] ? state[listId].order.filter(i => i !== itemId) : [],
        };
        return newState;
    },
    [listActionTypes.RESET_LIST]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.listId] = { order: [] };
        return newState;
    },

}, 'workingLists');


export const workingListsMetaDesc = createReducerDescription({
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

const getLoadingState = oldState => ({
    ...oldState,
    isLoading: true,
});
const getReadyState = (oldState, more) => ({
    ...oldState,
    ...more,
    isLoading: false,
    isUpdating: false,
    isUpdatingWithDialog: false,
});

export const workingListsUIDesc = createReducerDescription({
    [paginationActionTypes.CHANGE_PAGE]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getLoadingState(newState[listId]);
        return newState;
    },
    [paginationActionTypes.CHANGE_ROWS_PER_PAGE]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getLoadingState(newState[listId]);
        return newState;
    },
    [eventsListActionTypes.SORT_WORKING_LIST]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getLoadingState(newState[listId]);
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATING]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = { ...newState[listId], isUpdating: true };
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATING_WITH_DIALOG]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = { ...newState[listId], isUpdatingWithDialog: true };
        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getReadyState(newState[listId], {
            hasBeenLoaded: true,
            dataLoadingError: null,
        });
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getReadyState(newState[listId], {
            dataLoadingError: null,
        });
        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.listId] = getReadyState({}, {
            dataLoadingError: payload,
        });
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getReadyState({}, {
            dataLoadingError: null,  // reverting list to previous state and showing feedbackBar message
        });
        return newState;
    },
}, 'workingListsUI');

export const workingListsColumnsOrderDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newColumnsOrder = action.payload.columnsOrder;
        const payload = action.payload;

        if (!newColumnsOrder) {
            return state;
        }

        const newState = { ...state };
        newState[payload.listId] = payload.columnsOrder;
        return newState;
    },
    [columnSelectorActionTypes.UPDATE_WORKINGLIST_ORDER]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = [...action.payload.workinglist];
        return newState;
    },
    [listActionTypes.RESET_LIST]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.listId] = [...action.payload.columnsOrder];
        return newState;
    },
}, 'workingListsColumnsOrder');

export const workingListsContextDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.listId] = payload.selections;
        return newState;
    },
    [listActionTypes.RESET_LIST]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.listId] = action.payload.selections;
        return newState;
    },
    [quickSelectorActionTypes.RESET_PROGRAM_ID_BASE]: (state) => {
        const newState = {
            ...state,
            main: null,
        };
        return newState;
    },
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: (state, action) => {
        const payload = action.payload;
        const nextProgramId = payload.nextProps.programId;
        const prevProgramId = payload.prevProps.programId;
        if (nextProgramId !== prevProgramId) {
            return {
                ...state,
                main: null,
            };
        }
        return state;
    },
    [editEventSelectorActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const payload = action.payload;
        const nextProgramId = payload.eventContainer.event.programId;
        const prevProgramId = payload.prevProgramId;
        if (nextProgramId !== prevProgramId) {
            return {
                ...state,
                main: null,
            };
        }
        return state;
    },
    [viewEventActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const payload = action.payload;
        const nextProgramId = payload.eventContainer.event.programId;
        const prevProgramId = payload.prevProgramId;
        if (nextProgramId !== prevProgramId) {
            return {
                ...state,
                main: null,
            };
        }
        return state;
    },
}, 'workingListsContext');

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
    [filterSelectorActionTypes.REVERT_FILTER]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = {
            ...newState[listId],
            next: {},
        };
        return newState;
    },
    [quickSelectorActionTypes.RESET_PROGRAM_ID_BASE]: state => ({
        ...state,
        main: {},
    }),
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: updateFiltersEditOnUrlUpdate,
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

export const workingListsAppliedFiltersDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        const next = newState[listId] ? newState[listId].next : null;

        const stateWithNulls = {
            ...newState[listId],
            ...next,
        };

        const stateWithoutNulls = Object
            .keys(stateWithNulls)
            .reduce((accNewState, key) => {
                if (stateWithNulls[key]) {
                    accNewState[key] = stateWithNulls[key];
                }
                return accNewState;
            }, {});

        newState[listId] = {
            ...stateWithoutNulls,
            next: {},
        };

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

const updateUserSelectedFilersOnUrlUpdate = (state, action) => {
    const payload = action.payload;
    const nextProgramId = payload.nextProps.programId;
    const prevProgramId = payload.prevProps.programId;
    if (nextProgramId !== prevProgramId) {
        return {};
    }
    return state;
};
export const workingListsUserSelectedFiltersDesc = createReducerDescription({
    [filterSelectorActionTypes.REST_MENU_ITEM_SELECTED]: (state, action) => {
        const newState = {
            ...state,
            [action.payload.id]: true,
        };

        return newState;
    },
    [filterSelectorActionTypes.UPDATE_INCLUDED_FILTERS_AFTER_COLUMN_SORTING]: (state, action) => {
        const newState = action.payload.includeFilters;
        return newState;
    },
    [quickSelectorActionTypes.RESET_PROGRAM_ID_BASE]: () => ({}),
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: updateUserSelectedFilersOnUrlUpdate,
    [editEventSelectorActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const payload = action.payload;
        const nextProgramId = payload.eventContainer.event.programId;
        const prevProgramId = payload.prevProgramId;
        if (nextProgramId !== prevProgramId) {
            return {};
        }
        return state;
    },
    [viewEventActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const payload = action.payload;
        const nextProgramId = payload.eventContainer.event.programId;
        const prevProgramId = payload.prevProgramId;
        if (nextProgramId !== prevProgramId) {
            return {};
        }
        return state;
    },
}, 'workingListsUserSelectedFilters');
