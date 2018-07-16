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
import {
    actionTypes as quickSelectorActionTypes,
} from '../../components/QuickSelector/actions/QuickSelector.actions';
import {
    actionTypes as newEventSelectorActionTypes,
} from '../../components/Pages/NewEvent/newEventSelections.actions';
import {
    actionTypes as editEventSelectorActionTypes,
} from '../../components/Pages/EditEvent/editEvent.actions';

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

const updateListsMetaOnResetProgramId = (state) => {
    const newState = {
        ...state,
        main: {
            ...state.main,
            next: {
                ...(state.main ? state.main.next : null),
                sortById: 'eventDate',
                sortByDirection: 'desc',
                filters: state.main.filters ?
                    Object
                        .keys(state.main.filters)
                        .reduce((accFilters, key) => {
                            accFilters[key] = null;
                            return accFilters;
                        }, {}) :
                    null,
            },
        },
    };
    return newState;
};

const updateListsMetaOnUrlUpdate = (state, action) => {
    const payload = action.payload;
    const nextProgramId = payload.nextProps.programId;
    const prevProgramId = payload.prevProps.programId;
    if (nextProgramId !== prevProgramId) {
        return updateListsMetaOnResetProgramId(state);
    }
    return state;
};

export const workingListsMetaDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;

        const oldData = newState.main;
        const newData = newState.main && newState.main.next;

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

        newState.main = {
            ...oldData,
            ...newData,
            ...payload.argsWithDefaults,
            ...payload.pagingData,
            filters: filtersWithoutNull,
            next: {},
        };

        return newState;
    },
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED]: state => ({
        ...state,
        main: {
            ...state.main,
            next: {},
        },
    }),
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
    [quickSelectorActionTypes.RESET_PROGRAM_ID_BASE]: updateListsMetaOnResetProgramId,
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: updateListsMetaOnUrlUpdate,
    [newEventSelectorActionTypes.UPDATE_SELECTIONS_FROM_URL]: updateListsMetaOnUrlUpdate,
    [editEventSelectorActionTypes.EDIT_EVENT_FROM_URL]: updateListsMetaOnUrlUpdate,
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

const updateColumnsOrderOnResetProgram = (state) => {
    const newState = {
        ...state,
        main: null,
    };
    return newState;
};

const updateColumnsOrderOnUrlUpdate = (state, action) => {
    const payload = action.payload;
    const nextProgramId = payload.nextProps.programId;
    const prevProgramId = payload.prevProps.programId;
    if (nextProgramId !== prevProgramId) {
        return updateColumnsOrderOnResetProgram(state);
    }
    return state;
};

export const workingListsColumnsOrderDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newColumnsOrder = action.payload.columnsOrder;

        if (!newColumnsOrder) {
            return state;
        }

        const newState = { ...state };
        newState.main = action.payload.columnsOrder;
        return newState;
    },
    [columnSelectorActionTypes.UPDATE_WORKINGLIST_ORDER]: (state, action) => {
        const newState = { ...state };
        newState.main = [...action.payload];
        return newState;
    },
    [quickSelectorActionTypes.RESET_PROGRAM_ID_BASE]: updateColumnsOrderOnResetProgram,
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: updateColumnsOrderOnUrlUpdate,
    [newEventSelectorActionTypes.UPDATE_SELECTIONS_FROM_URL]: updateColumnsOrderOnUrlUpdate,
    [editEventSelectorActionTypes.EDIT_EVENT_FROM_URL]: updateColumnsOrderOnUrlUpdate,
}, 'workingListsColumnsOrder');

export const workingListsContextDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        newState.main = action.payload.selections;
        return newState;
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
    [quickSelectorActionTypes.RESET_PROGRAM_ID_BASE]: state => ({
        ...state,
        main: {},
    }),
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: updateFiltersEditOnUrlUpdate,
    [newEventSelectorActionTypes.UPDATE_SELECTIONS_FROM_URL]: updateFiltersEditOnUrlUpdate,
    [editEventSelectorActionTypes.EDIT_EVENT_FROM_URL]: updateFiltersEditOnUrlUpdate,
}, 'workingListFiltersEdit');

const updateApplitedFiltersOnProgramReset = state => ({
    ...state,
    main: {
        ...state.main,
        next: state.main ? Object.keys(state.main).reduce((accNextKeys, key) => {
            if (key !== 'next') {
                accNextKeys[key] = null;
            }
            return accNextKeys;
        }, {}) : null,
    },
});

const updateApplitedFiltersOnUrlUpdate = (state, action) => {
    const payload = action.payload;
    const nextProgramId = payload.nextProps.programId;
    const prevProgramId = payload.prevProps.programId;
    if (nextProgramId !== prevProgramId) {
        return updateApplitedFiltersOnProgramReset(state);
    }
    return state;
};

export const workingListsAppliedFiltersDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state) => {
        const newState = { ...state };
        const next = newState.main ? newState.main.next : null;

        const mainStateWithNulls = {
            ...newState.main,
            ...next,
        };

        const mainStateWithoutNulls = Object
            .keys(mainStateWithNulls)
            .reduce((accNewState, key) => {
                if (mainStateWithNulls[key]) {
                    accNewState[key] = mainStateWithNulls[key];
                }
                return accNewState;
            }, {});

        newState.main = {
            ...mainStateWithoutNulls,
            next: {},
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
    [quickSelectorActionTypes.RESET_PROGRAM_ID_BASE]: updateApplitedFiltersOnProgramReset,
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: updateApplitedFiltersOnUrlUpdate,
    [newEventSelectorActionTypes.UPDATE_SELECTIONS_FROM_URL]: updateApplitedFiltersOnUrlUpdate,
    [editEventSelectorActionTypes.EDIT_EVENT_FROM_URL]: updateApplitedFiltersOnUrlUpdate,
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
    [quickSelectorActionTypes.RESET_PROGRAM_ID_BASE]: () => ({}),
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: updateUserSelectedFilersOnUrlUpdate,
    [newEventSelectorActionTypes.UPDATE_SELECTIONS_FROM_URL]: updateUserSelectedFilersOnUrlUpdate,
    [editEventSelectorActionTypes.EDIT_EVENT_FROM_URL]: updateUserSelectedFilersOnUrlUpdate,
}, 'workingListsUserSelectedFilters');
