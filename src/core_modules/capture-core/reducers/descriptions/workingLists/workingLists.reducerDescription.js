// @flow
import { moment } from 'capture-core-utils/moment';
import { createReducerDescription } from '../../../trackerRedux/trackerReducer';
import { workingListsCommonActionTypes } from '../../../components/Pages/MainPage/WorkingListsCommon';
import { eventWorkingListsActionTypes } from '../../../components/Pages/MainPage/EventWorkingLists';
import { recentlyAddedEventsActionTypes } from '../../../components/DataEntries/SingleEventRegistrationEntry/DataEntryWrapper/RecentlyAddedEventsList';

export const workingListsListRecordsDesc = createReducerDescription({
    [workingListsCommonActionTypes.LIST_VIEW_INIT_SUCCESS]: (state, { payload: { storeId, recordContainers } }) => ({
        ...state,
        [storeId]: recordContainers
            .reduce((acc, { record, id }) => {
                acc[id] = record;
                return acc;
            }, {}),
    }),
    [workingListsCommonActionTypes.LIST_UPDATE_SUCCESS]: (state, { payload: { storeId, recordContainers } }) => ({
        ...state,
        [storeId]: recordContainers
            .reduce((acc, { record, id }) => {
                acc[id] = record;
                return acc;
            }, {}),
    }),
}, 'workingListsListRecords');

export const workingListsTemplatesDesc = createReducerDescription({
    [workingListsCommonActionTypes.TEMPLATES_FETCH]: (state, action) => {
        const { storeId } = action.payload;
        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                loading: true,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATES_FETCH_SUCCESS]: (state, action) => {
        const { templates, storeId, defaultTemplateId } = action.payload;
        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                templates,
                selectedTemplateId: defaultTemplateId,
                loading: false,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATES_FETCH_ERROR]: (state, action) => {
        const { storeId, error } = action.payload;
        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                loadError: error,
                loading: false,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_SELECT]: (state, action) => {
        const { storeId, templateId } = action.payload;
        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                selectedTemplateId: templateId,
                currentListId: storeId,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_UPDATE]: (state, action) => {
        const { criteria, template, storeId } = action.payload;

        const otherTemplates = state[storeId].templates.filter(t => t.id !== template.id);
        const updatedTemplate = {
            ...template,
            nextCriteria: criteria,
        };

        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                templates: [
                    ...otherTemplates,
                    updatedTemplate,
                ],
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_UPDATE_SUCCESS]: (state, action) => {
        const { criteria, templateId, storeId } = action.payload;
        const templates = state[storeId].templates;
        const targetTemplate = templates.find(t => t.id === templateId);

        if (targetTemplate) {  // the template could be deleted
            const otherTemplates = templates.filter(t => t.id !== templateId);
            const updatedTemplate = {
                ...targetTemplate,
                criteria,
                nextCriteria: undefined,
            };

            return {
                ...state,
                [storeId]: {
                    ...state[storeId],
                    templates: [
                        ...otherTemplates,
                        updatedTemplate,
                    ],
                },
            };
        }
        return state;
    },
    [workingListsCommonActionTypes.TEMPLATE_UPDATE_ERROR]: (state, action) => {
        const { templateId, storeId } = action.payload;

        const templates = state[storeId].templates;
        const targetTemplate = templates.find(t => t.id === templateId);

        if (targetTemplate) {
            const otherTemplates = templates.filter(t => t.id !== templateId);
            const updatedTemplate = {
                ...targetTemplate,
                nextCriteria: undefined,
            };

            return {
                ...state,
                [storeId]: {
                    ...state[storeId],
                    templates: [
                        ...otherTemplates,
                        updatedTemplate,
                    ],
                },
            };
        }
        return state;
    },
    [workingListsCommonActionTypes.TEMPLATE_ADD]: (state, action) => {
        const { name, criteria, template, clientId, storeId } = action.payload;

        const newTemplate = {
            ...template,
            name,
            displayName: name,
            id: clientId,
            criteria,
            isDefault: undefined,
            notPreserved: true,
            skipInitDuringAddProcedure: true,
            access: {
                update: true,
                delete: true,
                write: true,
                manage: true,
            },
        };

        const templates = state[storeId].templates;

        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                selectedTemplateId: clientId,
                templates: [
                    ...templates,
                    newTemplate,
                ],
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_ADD_SUCCESS]: (state, action) => {
        const { templateId, clientId, storeId } = action.payload;
        const templates = state[storeId].templates;
        const targetTemplate = templates.find(t => t.id === clientId);
        const otherTemplates = templates.filter(t => t.id !== clientId);

        const currentlySelectedTemplateId = state[storeId].selectedTemplateId;

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
            [storeId]: {
                ...state[storeId],
                selectedTemplateId,
                templates: [
                    ...otherTemplates,
                    updatedTemplate,
                ],
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_ADD_ERROR]: (state, action) => {
        const { clientId, storeId } = action.payload;
        const templates = state[storeId].templates.filter(t => t.id !== clientId);
        const currentlySelectedTemplateId = state[storeId].selectedTemplateId;
        const selectedTemplateId = currentlySelectedTemplateId === clientId ?
            templates.find(t => t.isDefault).id :
            currentlySelectedTemplateId;

        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                selectedTemplateId,
                templates,
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_DELETE]: (state, action) => {
        const { template, storeId } = action.payload;

        const otherTemplates = state[storeId].templates.filter(t => t.id !== template.id);
        const deletedTemplate = {
            ...template,
            deleted: true,
        };

        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                selectedTemplateId: otherTemplates.find(t => t.isDefault).id,
                templates: [
                    ...otherTemplates,
                    deletedTemplate,
                ],
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_DELETE_SUCCESS]: (state, action) => {
        const { template, storeId } = action.payload;
        const otherTemplates = state[storeId].templates.filter(t => t.id !== template.id);

        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                templates: [
                    ...otherTemplates,
                ],
            },
        };
    },
    [workingListsCommonActionTypes.TEMPLATE_DELETE_ERROR]: (state, action) => {
        const { template, storeId } = action.payload;

        const otherTemplates = state[storeId].templates.filter(t => t.id !== template.id);
        const failedToDeleteTemplate = {
            ...template,
            deleted: undefined,
        };
        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                templates: [
                    ...otherTemplates,
                    failedToDeleteTemplate,
                ],
            },
        };
    },
}, 'workingListsTemplates');

export const workingListsDesc = createReducerDescription({
    [workingListsCommonActionTypes.LIST_VIEW_INIT]: (state, action) => {
        const { storeId } = action.payload;
        return {
            ...state,
            [storeId]: undefined,
        };
    },
    [workingListsCommonActionTypes.LIST_VIEW_INIT_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const { storeId, recordContainers, request } = action.payload;
        newState[storeId] = {
            order: recordContainers
                .map(({ id }) => id),
            currentRequest: request,
        };
        return newState;
    },
    [workingListsCommonActionTypes.LIST_UPDATE_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const { storeId, recordContainers, request } = action.payload;
        newState[storeId] = {
            order: recordContainers
                .map(({ id }) => id),
            currentRequest: request,
        };

        return newState;
    },
    [recentlyAddedEventsActionTypes.LIST_ITEM_PREPEND]: (state, action) => {
        const newState = { ...state };
        const { listId, itemId } = action.payload;
        newState[listId] = {
            order: [itemId, ...(state[listId] ? state[listId].order : [])],
        };
        return newState;
    },
    [recentlyAddedEventsActionTypes.LIST_ITEM_REMOVE]: (state, action) => {
        const newState = { ...state };
        const { listId, itemId } = action.payload;
        newState[listId] = {
            order: state[listId] ? state[listId].order.filter(i => i !== itemId) : [],
        };
        return newState;
    },
    [recentlyAddedEventsActionTypes.LIST_RESET]: (state, action) => {
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
    [workingListsCommonActionTypes.LIST_VIEW_INIT]: (state, action) => {
        const newState = { ...state };
        const storeId = action.payload.storeId;
        newState[storeId] = { ...newState[storeId], isLoading: true };
        return newState;
    },
    [workingListsCommonActionTypes.LIST_VIEW_INIT_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const storeId = action.payload.storeId;
        newState[storeId] = getReadyState(newState[storeId], {
            hasBeenLoaded: true,
            dataLoadingError: null,
        });
        return newState;
    },
    [workingListsCommonActionTypes.LIST_VIEW_INIT_ERROR]: (state, action) => {
        const newState = { ...state };
        const payload = action.payload;
        newState[payload.storeId] = getReadyState({}, {
            dataLoadingError: payload.errorMessage,
        });
        return newState;
    },
    [workingListsCommonActionTypes.LIST_UPDATE]: (state, action) => {
        const newState = { ...state };
        const storeId = action.payload.storeId;
        newState[storeId] = { ...newState[storeId], isUpdating: true };
        return newState;
    },
    [workingListsCommonActionTypes.LIST_UPDATE_SUCCESS]: (state, action) => {
        const newState = { ...state };
        const storeId = action.payload.storeId;
        newState[storeId] = getReadyState(newState[storeId], {
            dataLoadingError: null,
        });
        return newState;
    },
    [workingListsCommonActionTypes.LIST_UPDATE_ERROR]: (state, action) => {
        const newState = { ...state };
        const storeId = action.payload.storeId;
        newState[storeId] = getReadyState({}, {
            dataLoadingError: null,
        });
        return newState;
    },
    [eventWorkingListsActionTypes.EVENT_REQUEST_DELETE]: (state, action) => {
        const storeId = action.payload.storeId;
        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                isUpdatingWithDialog: true,
            },
        };
    },
    [eventWorkingListsActionTypes.EVENT_DELETE_SUCCESS]: (state, action) => {
        const { storeId, eventId } = action.payload;
        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                lastEventIdDeleted: eventId,
                isUpdatingWithDialog: false,
            },
        };
    },
    [eventWorkingListsActionTypes.EVENT_DELETE_ERROR]: (state, action) => {
        const { storeId } = action.payload;
        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                isUpdatingWithDialog: false,
            },
        };
    },
}, 'workingListsUI');

export const workingListsColumnsOrderDesc = createReducerDescription({
    [workingListsCommonActionTypes.LIST_VIEW_INIT]: (state, action) => {
        const { storeId } = action.payload;
        return {
            ...state,
            [storeId]: undefined,
        };
    },
    [workingListsCommonActionTypes.LIST_VIEW_INIT_SUCCESS]: (state, action) => {
        const { storeId, config: { customColumnOrder } } = action.payload;
        return {
            ...state,
            [storeId]: customColumnOrder,
        };
    },
    [workingListsCommonActionTypes.LIST_COLUMN_ORDER_SET]: (state, action) => {
        const { columns, storeId } = action.payload;
        return {
            ...state,
            [storeId]: columns
                .map(({ id, visible }) => ({
                    id,
                    visible,
                })),
        };
    },
    [recentlyAddedEventsActionTypes.LIST_RESET]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.listId] = [...action.payload.columnOrder];
        return newState;
    },
}, 'workingListsColumnsOrder');

export const workingListsContextDesc = createReducerDescription({
    /*
    Setting context on templates fetch and list view init (not on success anymore) because it makes sense for the loading effect.
    The meaning is slightly changed though, having a context now implies that a request was done for this context,
    not that data was successfully retrieved for this context.
    */
    [workingListsCommonActionTypes.TEMPLATES_FETCH]: (state, action) => {
        const { programId, storeId } = action.payload;
        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                programIdTemplates: programId,
            },
        };
    },
    [workingListsCommonActionTypes.LIST_VIEW_INIT]: (state, action) => {
        const { storeId, context: { programId, lastTransaction, ...restContext } } = action.payload;
        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                ...restContext,
                programIdView: programId,
                listDataRefreshTimestamp: moment().toISOString(),
                lastTransactionOnListDataRefresh: lastTransaction,
            },
        };
    },
    [workingListsCommonActionTypes.LIST_UPDATE]: (state, action) => {
        const { storeId, lastTransaction } = action.payload;
        return {
            ...state,
            [storeId]: {
                ...state[storeId],
                listDataRefreshTimestamp: moment().toISOString(),
                lastTransactionOnListDataRefresh: lastTransaction,
            },
        };
    },
    [recentlyAddedEventsActionTypes.LIST_RESET]: (state, action) => {
        const newState = { ...state };
        newState[action.payload.listId] = action.payload.selections;
        return newState;
    },
}, 'workingListsContext');

export const workingListsStickyFiltersDesc = createReducerDescription({
    [workingListsCommonActionTypes.LIST_VIEW_INIT]: (state, action) => {
        const { storeId } = action.payload;
        return {
            ...state,
            [storeId]: undefined,
        };
    },
    [workingListsCommonActionTypes.LIST_VIEW_INIT_SUCCESS]: (state, action) => {
        const { storeId, config } = action.payload;
        const filters = config.filters;
        const filtersWithValueOnInit = filters ? Object.keys(filters).reduce((acc, key) => ({
            ...acc,
            [key]: true,
        }), {}) : undefined;

        return {
            ...state,
            [storeId]: {
                filtersWithValueOnInit,
                userSelectedFilters: undefined,
            },
        };
    },
    [workingListsCommonActionTypes.REST_MENU_ITEM_SELECT]: (state, action) => {
        const { id, storeId } = action.payload;
        const currentListState = {
            ...state[storeId],
            userSelectedFilters: {
                ...state[storeId].userSelectedFilters,
                [id]: true,
            },
        };

        return {
            ...state,
            [storeId]: currentListState,
        };
    },
    [workingListsCommonActionTypes.STICKY_FILTERS_AFTER_COLUMN_SORTING_SET]: (state, action) => {
        const { storeId, includeFilters: filtersWithValueOnInit } = action.payload;
        return {
            ...state,
            [storeId]: {
                filtersWithValueOnInit,
                userSelectedFilters: undefined,
            },
        };
    },
}, 'workingListsStickyFilters');
