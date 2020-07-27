// @flow
import { moment } from 'capture-core-utils/moment';
import { createReducerDescription } from '../../../trackerRedux/trackerReducer';
import {
    actionTypes as columnSelectorActionTypes,
} from '../../../components/Pages/MainPage/EventsList/ListWrapper/actions/columnSelectorDialog.actions';
import {
    actionTypes as filterSelectorActionTypes,
} from '../../../components/Pages/MainPage/EventsList/FilterSelectors/filterSelector.actions';
import { actionTypes as eventListActionTypes } from '../../../components/Pages/MainPage/EventsList/eventsList.actions';
import {
    actionTypes as listActionTypes,
} from '../../../components/List/list.actions';
import { actionTypes as workingListsActionTypes } from '../../../components/Pages/MainPage/WorkingLists';

export const workingListsTemplatesDesc = createReducerDescription({
    [workingListsActionTypes.TEMPLATES_FETCH]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                loading: true,
            },
        };
    },
    [workingListsActionTypes.TEMPLATES_FETCH_SUCCESS]: (state, action) => {
        const { programId, templates, listId } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                templates,
                programId,
                loading: false,
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
                loading: false,
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
    [workingListsActionTypes.TEMPLATE_UPDATE]: (state, action) => {
        const { eventQueryCriteria, template, listId } = action.payload;

        const otherTemplates = state[listId].templates.filter(t => t.id !== template.id);
        const updatedTemplate = {
            ...template,
            nextEventQueryCriteria: eventQueryCriteria,
        };

        return {
            ...state,
            [listId]: {
                ...state[listId],
                templates: [
                    ...otherTemplates,
                    updatedTemplate,
                ],
            },
        };
    },
    [workingListsActionTypes.TEMPLATE_UPDATE_SUCCESS]: (state, action) => {
        const { eventQueryCriteria, templateId, listId } = action.payload;
        const templates = state[listId].templates;
        const targetTemplate = templates.find(t => t.id === templateId);

        if (targetTemplate) {  // the template could be deleted
            const otherTemplates = templates.filter(t => t.id !== templateId);
            const updatedTemplate = {
                ...targetTemplate,
                eventQueryCriteria,
                nextEventQueryCriteria: undefined,
            };

            return {
                ...state,
                [listId]: {
                    ...state[listId],
                    templates: [
                        ...otherTemplates,
                        updatedTemplate,
                    ],
                },
            };
        }
        return state;
    },
    [workingListsActionTypes.TEMPLATE_UPDATE_ERROR]: (state, action) => {
        const { templateId, listId } = action.payload;

        const templates = state[listId].templates;
        const targetTemplate = templates.find(t => t.id === templateId);

        if (targetTemplate) {
            const otherTemplates = templates.filter(t => t.id !== templateId);
            const updatedTemplate = {
                ...targetTemplate,
                nextEventQueryCriteria: undefined,
            };

            return {
                ...state,
                [listId]: {
                    ...state[listId],
                    templates: [
                        ...otherTemplates,
                        updatedTemplate,
                    ],
                },
            };
        }
        return state;
    },
    [workingListsActionTypes.TEMPLATE_ADD]: (state, action) => {
        const { name, eventQueryCriteria, template, clientId, listId } = action.payload;

        const newTemplate = {
            ...template,
            name,
            displayName: name,
            id: clientId,
            eventQueryCriteria,
            isDefault: undefined,
            notPreserved: true,
            skipInitDuringAddProcedure: true,
            access: {
                read: true,
                update: true,
                delete: true,
                write: true,
                manage: true,
            },
        };

        const templates = state[listId].templates;

        return {
            ...state,
            [listId]: {
                ...state[listId],
                selectedTemplateId: clientId,
                templates: [
                    ...templates,
                    newTemplate,
                ],
            },
        };
    },
    [workingListsActionTypes.TEMPLATE_ADD_SKIP_INIT_CLEAN]: (state, action) => {
        const { template, listId } = action.payload;
        const templates = state[listId].templates;
        const targetTemplate = templates.find(t => t.id === template.id);

        if (targetTemplate) {
            const otherTemplates = templates.filter(t => t.id !== template.id);

            const updatedTemplate = {
                ...targetTemplate,
                skipInitDuringAddProcedure: undefined,
            };

            return {
                ...state,
                [listId]: {
                    ...state[listId],
                    templates: [
                        ...otherTemplates,
                        updatedTemplate,
                    ],
                },
            };
        }
        return state;
    },
    [workingListsActionTypes.TEMPLATE_ADD_SUCCESS]: (state, action) => {
        const { templateId, clientId, listId } = action.payload;
        const templates = state[listId].templates;
        const targetTemplate = templates.find(t => t.id === clientId);
        const otherTemplates = templates.filter(t => t.id !== clientId);

        const currentlySelectedTemplateId = state[listId].selectedTemplateId;

        let selectedTemplateId = currentlySelectedTemplateId;
        let skipInitDuringAddProcedure;
        if (currentlySelectedTemplateId === clientId) {
            selectedTemplateId = templateId;
            skipInitDuringAddProcedure = true;
        }

        const updatedTemplate = {
            ...targetTemplate,
            id: templateId,
            notPreserved: undefined,
            skipInitDuringAddProcedure,
        };

        return {
            ...state,
            [listId]: {
                ...state[listId],
                selectedTemplateId,
                templates: [
                    ...otherTemplates,
                    updatedTemplate,
                ],
            },
        };
    },
    [workingListsActionTypes.TEMPLATE_ADD_ERROR]: (state, action) => {
        const { clientId, listId } = action.payload;
        const templates = state[listId].templates.filter(t => t.id !== clientId);
        const currentlySelectedTemplateId = state[listId].selectedTemplateId;
        const selectedTemplateId = currentlySelectedTemplateId === clientId ?
            templates.find(t => t.isDefault).id :
            currentlySelectedTemplateId;

        return {
            ...state,
            [listId]: {
                ...state[listId],
                selectedTemplateId,
                templates,
            },
        };
    },
    [workingListsActionTypes.TEMPLATE_DELETE]: (state, action) => {
        const { template, listId } = action.payload;

        const otherTemplates = state[listId].templates.filter(t => t.id !== template.id);
        const deletedTemplate = {
            ...template,
            deleted: true,
        };

        return {
            ...state,
            [listId]: {
                ...state[listId],
                selectedTemplateId: otherTemplates.find(t => t.isDefault).id,
                templates: [
                    ...otherTemplates,
                    deletedTemplate,
                ],
            },
        };
    },
    [workingListsActionTypes.TEMPLATE_DELETE_SUCCESS]: (state, action) => {
        const { template, listId } = action.payload;
        const otherTemplates = state[listId].templates.filter(t => t.id !== template.id);

        return {
            ...state,
            [listId]: {
                ...state[listId],
                templates: [
                    ...otherTemplates,
                ],
            },
        };
    },
    [workingListsActionTypes.TEMPLATE_DELETE_ERROR]: (state, action) => {
        const { template, listId } = action.payload;

        const otherTemplates = state[listId].templates.filter(t => t.id !== template.id);
        const failedToDeleteTemplate = {
            ...template,
            deleted: undefined,
        };
        return {
            ...state,
            [listId]: {
                ...state[listId],
                templates: [
                    ...otherTemplates,
                    failedToDeleteTemplate,
                ],
            },
        };
    },
}, 'workingListsTemplates');

export const workingListsDesc = createReducerDescription({
    [workingListsActionTypes.EVENT_LIST_INIT]: (state, action) => {
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
    [workingListsActionTypes.EVENT_LIST_INIT]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = { ...newState[listId], isLoading: true };
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
    [workingListsActionTypes.EVENT_LIST_INIT_ERROR]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.listId] = getReadyState({}, {
            dataLoadingError: payload.errorMessage,
        });
        return newState;
    },
    [workingListsActionTypes.EVENT_LIST_UPDATE]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = { ...newState[listId], isUpdating: true };
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
    [workingListsActionTypes.EVENT_LIST_UPDATE_ERROR]: (state, action) => {
        const newState = { ...state };
        const listId = action.payload.listId;
        newState[listId] = getReadyState({}, {
            dataLoadingError: null,
        });
        return newState;
    },
    [eventListActionTypes.REQUEST_DELETE_EVENT]: (state, action) => {
        const listId = action.payload.listId;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                isUpdatingWithDialog: true,
            },
        };
    },
    [workingListsActionTypes.EVENT_DELETE_SUCCESS]: (state, action) => {
        const { listId, eventId } = action.payload;
        return {
            ...state,
            [listId]: {
                ...state[listId],
                lastEventIdDeleted: eventId,
            },
        };
    },
}, 'workingListsUI');

export const workingListsColumnsOrderDesc = createReducerDescription({
    [workingListsActionTypes.EVENT_LIST_INIT]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
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
            .map((co) => {
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
}, 'workingListsColumnsOrder');

export const workingListsContextDesc = createReducerDescription({
    /*
    Setting context on init (not on success anymore) because it makes sense for the loading effect.
    The meaning is slightly changed though, having a context now implies that a request for events was done for this context,
    not that events was successfully retrieved for this context.
    */
    [workingListsActionTypes.EVENT_LIST_INIT]: (state, action) => {
        const newState = { ...state };
        const { listId, context } = action.payload;
        newState[listId] = {
            ...context,
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

export const workingListsStickyFiltersDesc = createReducerDescription({
    [workingListsActionTypes.EVENT_LIST_INIT]: (state, action) => {
        const { listId } = action.payload;
        return {
            ...state,
            [listId]: undefined,
        };
    },
    [workingListsActionTypes.EVENT_LIST_INIT_SUCCESS]: (state, action) => {
        const { listId, config } = action.payload;
        const filters = config.filters;
        const filtersWithValueOnInit = filters ? Object.keys(filters).reduce((acc, key) => ({
            ...acc,
            [key]: true,
        }), {}) : undefined;

        return {
            ...state,
            [listId]: {
                filtersWithValueOnInit,
                userSelectedFilters: undefined,
            },
        };
    },
    [filterSelectorActionTypes.REST_MENU_ITEM_SELECTED]: (state, action) => {
        const { id, listId } = action.payload;
        const currentListState = {
            ...state[listId],
            userSelectedFilters: {
                ...state[listId].userSelectedFilters,
                [id]: true,
            },
        };

        return {
            ...state,
            [listId]: currentListState,
        };
    },
    [filterSelectorActionTypes.UPDATE_INCLUDED_FILTERS_AFTER_COLUMN_SORTING]: (state, action) => {
        const { listId, includeFilters: filtersWithValueOnInit } = action.payload;
        return {
            ...state,
            [listId]: {
                filtersWithValueOnInit,
                userSelectedFilters: undefined,
            },
        };
    },
}, 'workingListsStickyFilters');
