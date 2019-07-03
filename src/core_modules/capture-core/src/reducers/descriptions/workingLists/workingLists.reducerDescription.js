// @flow
import { createReducerDescription } from '../../../trackerRedux/trackerReducer';
import { actionTypes as mainSelectionsActionTypes } from '../../../components/Pages/MainPage/mainSelections.actions';
import {
    actionTypes as paginationActionTypes,
} from '../../../components/Pages/MainPage/EventsList/Pagination/pagination.actions';
import { actionTypes as eventsListActionTypes } from '../../../components/Pages/MainPage/EventsList/eventsList.actions';
import {
    dataEntryActionTypes as newEventDataEntryActionTypes,
} from '../../../components/Pages/NewEvent';
import {
    actionTypes as connectivityActionTypes,
} from '../../../components/Connectivity/connectivity.actions';
import {
    actionTypes as columnSelectorActionTypes,
} from '../../../components/Pages/MainPage/EventsList/ListWrapperMenu/actions/columnSelectorDialog.actions';
import {
    actionTypes as filterSelectorActionTypes,
} from '../../../components/Pages/MainPage/EventsList/FilterSelectors/filterSelector.actions';
import {
    actionTypes as quickSelectorActionTypes,
} from '../../../components/QuickSelector/actions/QuickSelector.actions';
import {
    actionTypes as editEventSelectorActionTypes,
} from '../../../components/Pages/EditEvent/editEvent.actions';
import {
    actionTypes as viewEventActionTypes,
} from '../../../components/Pages/ViewEvent/viewEvent.actions';
import {
    actionTypes as listActionTypes,
} from '../../../components/List/list.actions';

const setMainEventPageWorkingListConfigSelectorLoading = state => ({
    ...state,
    eventMainPage: {
        ...state.eventMainPage,
        isLoading: true,
    },
});

export const workingListConfigSelectorDesc = createReducerDescription({
    [connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT]: setMainEventPageWorkingListConfigSelectorLoading,
    [mainSelectionsActionTypes.MAIN_SELECTIONS_COMPLETED]: setMainEventPageWorkingListConfigSelectorLoading,
    [viewEventActionTypes.INITIALIZE_WORKING_LISTS_ON_BACK_TO_MAIN_PAGE]: setMainEventPageWorkingListConfigSelectorLoading,
    [viewEventActionTypes.UPDATE_WORKING_LIST_ON_BACK_TO_MAIN_PAGE]: setMainEventPageWorkingListConfigSelectorLoading,
    [newEventDataEntryActionTypes.CANCEL_SAVE_INITIALIZE_WORKING_LISTS]: setMainEventPageWorkingListConfigSelectorLoading,
    [newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST]: setMainEventPageWorkingListConfigSelectorLoading,
    [newEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE]: setMainEventPageWorkingListConfigSelectorLoading,
    [eventsListActionTypes.WORKING_LIST_CONFIGS_RETRIEVED]: (state, action) => ({
        ...state,
        eventMainPage: {
            ...state.eventMainPage,
            workingListConfigs: action.payload.workingListConfigs,
        },
    }),
    [eventsListActionTypes.WORKING_LIST_CONFIGS_RETRIEVAL_FAILED]: (state, action) => ({
        ...state,
        eventMainPage: {
            ...state.eventMainPage,
            isLoading: false,
            loadError: action.payload.error,
        },
    }),
    [eventsListActionTypes.SET_CURRENT_WORKING_LIST_CONFIG]: (state, action) => ({
        ...state,
        eventMainPage: {
            ...state.eventMainPage,
            currentConfigId: action.payload.configId,
            currentListId: action.payload.listId,
        },
    }),
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: state => ({
        ...state,
        eventMainPage: {
            ...state.eventMainPage,
            isLoading: false,
            loadError: null,
        },
    }),
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: state => ({
        ...state,
        eventMainPage: {
            ...state.eventMainPage,
            isLoading: false,
            loadError: null,
        },
    }),
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED]: state => ({
        ...state,
        eventMainPage: {
            ...state.eventMainPage,
            isLoading: false,
        },
    }),
}, 'workingListConfigSelector');

export const workingListsDesc = createReducerDescription({
    [mainSelectionsActionTypes.WORKING_LIST_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const { listId, eventContainers, request } = action.payload;
        newState[listId] = {
            order: eventContainers ?
                eventContainers
                    .map(container => container.event.eventId) : [],
            type: 'event',
            currentRequest: request,
        };
        return newState;
    },
    [eventsListActionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED]: (state, action) => {
        const newState = { ...state };
        const { listId, eventContainers, request } = action.payload;
        newState[listId] = {
            order: eventContainers ?
                eventContainers
                    .map(container => container.event.eventId) : [],
            type: 'event',
            currentRequest: request,
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
    [eventsListActionTypes.SET_CURRENT_WORKING_LIST_CONFIG]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getLoadingState(newState[listId]);
        return newState;
    },
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
            dataLoadingError: payload.errorMessage,
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
    [eventsListActionTypes.SET_CURRENT_WORKING_LIST_CONFIG]: (state, action) => ({
        ...state,
        [action.payload.listId]: null,
    }),
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
    // TOO COMPLICATED?? Reason about this
    [quickSelectorActionTypes.RESET_PROGRAM_ID_BASE]: (state) => {
        const newState = {
            ...state,
            eventList: null,
        };
        return newState;
    },
    // TOO COMPLICATED?? Reason about this
    [mainSelectionsActionTypes.UPDATE_MAIN_SELECTIONS_FROM_URL]: (state, action) => {
        const payload = action.payload;
        const nextProgramId = payload.nextProps.programId;
        const prevProgramId = payload.prevProps.programId;
        if (nextProgramId !== prevProgramId) {
            return {
                ...state,
                eventList: null,
            };
        }
        return state;
    },
    // TOO COMPLICATED?? Reason about this
    [editEventSelectorActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const payload = action.payload;
        const nextProgramId = payload.eventContainer.event.programId;
        const prevProgramId = payload.prevProgramId;
        if (nextProgramId !== prevProgramId) {
            return {
                ...state,
                eventList: null,
            };
        }
        return state;
    },
    // TOO COMPLICATED?? Reason about this
    [viewEventActionTypes.EVENT_FROM_URL_RETRIEVED]: (state, action) => {
        const payload = action.payload;
        const nextProgramId = payload.eventContainer.event.programId;
        const prevProgramId = payload.prevProgramId;
        if (nextProgramId !== prevProgramId) {
            return {
                ...state,
                eventList: null,
            };
        }
        return state;
    },
}, 'workingListsContext');

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
    [eventsListActionTypes.SET_CURRENT_WORKING_LIST_CONFIG]: (state, action) => {
        const { filters } = action.payload;
        const selectedFilters = filters ? filters.reduce((accFilters, filter) => ({
            ...accFilters,
            [filter.id]: true,
        }), {}) : {};

        return {
            ...state,
            ...selectedFilters,
        };
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
