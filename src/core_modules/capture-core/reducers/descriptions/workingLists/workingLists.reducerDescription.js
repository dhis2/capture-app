// @flow
import { moment } from 'capture-core-utils/moment';
import { createReducerDescription } from '../../../trackerRedux/trackerReducer';
import {
    actionTypes as columnSelectorActionTypes,
} from '../../../components/Pages/MainPage/EventsList/ListWrapper/actions/columnSelectorDialog.actions';
import {
    actionTypes as filterSelectorActionTypes,
} from '../../../components/Pages/MainPage/EventsList/FilterSelectors/filterSelector.actions';
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
                templates,
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
        newState[listId] = { ...newState[listId], isLoading: true };
        return newState;
    },
    [workingListsActionTypes.EVENT_LIST_UPDATE]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = { ...newState[listId], isUpdating: true };
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
    [workingListsActionTypes.EVENT_DELETE]: (state, action) => {
        const listId = action.payload.listId;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                isUpdatingWithDialog: true,
            },
        };
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
        const { listId, config } = action.payload;
        newState[listId] = {
            ...config.selections,
            timestamp: moment().toISOString(),
        };
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
        const { listId, config } = action.payload;
        const filters = config.filters;
        const selectedFilters = filters ? Object.keys(filters).reduce((acc, key) => ({
            ...acc,
            [key]: true,
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
