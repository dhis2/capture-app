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
} from '../../../components/Pages/MainPage/EventsList/ListWrapper/actions/columnSelectorDialog.actions';
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
import { actionTypes as workingListsActionTypes } from '../../../components/Pages/MainPage/WorkingLists';

export const workingListsTemplatesDesc = createReducerDescription({
    [workingListsActionTypes.DATA_PRE_CLEAN]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
    [workingListsActionTypes.TEMPLATES_FETCH_SUCCESS]: (state, action) => {
        const { listId, templates } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                templates: templates,
            },
        };
    },
    [workingListsActionTypes.TEMPLATES_FETCH_ERROR]: (state, action) => {
        const { listId, error } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                loadError: error,
            },
        };
    },
    [workingListsActionTypes.TEMPLATE_SELECT]: (state, action) => {
        const { listId, templateId } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                selectedTemplateId: templateId,
                currentListId: listId,
            },
        };
    },
    /*
    [connectivityActionTypes.GET_EVENT_LIST_ON_RECONNECT]: setMainEventPageWorkingListConfigSelectorLoading,
    [mainSelectionsActionTypes.MAIN_SELECTIONS_COMPLETED]: setMainEventPageWorkingListConfigSelectorLoading,
    [viewEventActionTypes.INITIALIZE_WORKING_LISTS_ON_BACK_TO_MAIN_PAGE]: setMainEventPageWorkingListConfigSelectorLoading,
    [viewEventActionTypes.UPDATE_WORKING_LIST_ON_BACK_TO_MAIN_PAGE]: setMainEventPageWorkingListConfigSelectorLoading,
    [newEventDataEntryActionTypes.CANCEL_SAVE_INITIALIZE_WORKING_LISTS]: setMainEventPageWorkingListConfigSelectorLoading,
    [newEventDataEntryActionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST]: setMainEventPageWorkingListConfigSelectorLoading,
    [newEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE]: setMainEventPageWorkingListConfigSelectorLoading,
    */
}, 'workingListsTemplates');

export const workingListsDesc = createReducerDescription({
    [workingListsActionTypes.DATA_PRE_CLEAN]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
    [workingListsActionTypes.EVENT_LIST_INIT_SUCCESS]: (state, action) => {
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
    [workingListsActionTypes.EVENT_LIST_UPDATE_SUCCESS]: (state, action) => {
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
    [workingListsActionTypes.DATA_PRE_CLEAN]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
    [workingListsActionTypes.EVENT_LIST_INIT]: (state, action) => {
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
    [workingListsActionTypes.EVENT_LIST_INIT_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getReadyState(newState[listId], {
            hasBeenLoaded: true,
            dataLoadingError: null,
        });
        return newState;
    },
    [workingListsActionTypes.EVENT_LIST_UPDATE_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getReadyState(newState[listId], {
            dataLoadingError: null,
        });
        return newState;
    },
    [workingListsActionTypes.EVENT_LIST_INIT_ERROR]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.listId] = getReadyState({}, {
            dataLoadingError: payload.errorMessage,
        });
        return newState;
    },
    [workingListsActionTypes.EVENT_LIST_UPDATE_ERROR]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getReadyState({}, {
            dataLoadingError: null,  // reverting list to previous state and showing feedbackBar message
        });
        return newState;
    },
}, 'workingListsUI');

export const workingListsColumnsOrderDesc = createReducerDescription({
    [workingListsActionTypes.EVENT_LIST_INIT_SUCCESS]: (state, action) => {
        const { listId, config } = action.payload;
        const columnOrder = config.columnOrder;
        return {
            ...state,
            [listId]: columnOrder,
        };
    },
    [columnSelectorActionTypes.UPDATE_WORKINGLIST_ORDER]: (state, action) => {
        const { columnOrder, listId } = action.payload;

        const currentColumnOrder = state[listId];
        const newColumnOrder = columnOrder
            .map(co => {
                const stateElement = currentColumnOrder.find(cco => cco.id === co.id);
                const newOrderELement = {
                    ...stateElement,
                    visible: co.visible,
                };
                return newOrderELement;
            });

        return {
            ...state,
            [listId]: newColumnOrder,
        };
    },
    [listActionTypes.RESET_LIST]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.listId] = [...action.payload.columnOrder];
        return newState;
    },
    [workingListsActionTypes.DATA_PRE_CLEAN]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
}, 'workingListsColumnsOrder');

export const workingListsContextDesc = createReducerDescription({
    [workingListsActionTypes.DATA_PRE_CLEAN]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
    [workingListsActionTypes.EVENT_LIST_INIT_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.listId] = payload.selections;
        return newState;
    },
    // TODO: WHAT IS THIS!??!?!?
    [listActionTypes.RESET_LIST]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.listId] = action.payload.selections;
        return newState;
    },
}, 'workingListsContext');

export const workingListsUserSelectedFiltersDesc = createReducerDescription({
    [workingListsActionTypes.DATA_PRE_CLEAN]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
    [filterSelectorActionTypes.REST_MENU_ITEM_SELECTED]: (state, action) => {
        const { id, listId } = action.payload;
        const currentListState = {
            ...state[listId],
            [id]: true,
        };

        return {
            ...state,
            [listId]: currentListState,
        };
    },
    [workingListsActionTypes.EVENT_LIST_INIT_SUCCESS]: (state, action) => {
        const { listId, config = {} } = action.payload;
        const filters = config.filters;
        const selectedFilters = filters ? filters.reduce((acc, filter) => ({
            ...acc,
            [filter.id]: true,
        }), {}) : {};

        return {
            ...state,
            [listId]: selectedFilters,
        };
    },
    [filterSelectorActionTypes.UPDATE_INCLUDED_FILTERS_AFTER_COLUMN_SORTING]: (state, action) => {
        const { listId, includeFilters } = action.payload;
        return {
            ...state,
            [listId]: includeFilters,
        };
    },
}, 'workingListsUserSelectedFilters');
