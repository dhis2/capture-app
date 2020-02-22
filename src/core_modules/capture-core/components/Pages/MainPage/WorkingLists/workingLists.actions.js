// @flow
import { methods } from '../../../../trackerOffline/trackerOfflineConfig.const';
import { actionCreator } from '../../../../actions/actions.utils';

export const actionTypes = {
    DATA_PRE_CLEAN: 'EventWorkingListsDataPreClean',
    TEMPLATES_FETCH: 'EventWorkingListsTemplatesFetch',
    TEMPLATES_FETCH_SUCCESS: 'EventWorkingListsTemplatesFetchSuccess',
    TEMPLATES_FETCH_ERROR: 'EventWorkingListsTemplatesFetchError',
    TEMPLATES_FETCH_CANCEL: 'EventWorkingListsTemplatesFetchCancel',
    TEMPLATE_SELECT: 'EventWorkingListsTemplateSelect',
    TEMPLATE_ADD: 'EventWorkingListsTemplateAdd',
    TEMPLATE_ADD_SUCCESS: 'EventWorkingListsTemplateAddSuccess',
    TEMPLATE_ADD_ERROR: 'EventWorkingListsTemplateAddError',
    TEMPLATE_UPDATE: 'EventWorkingListsTemplateUpdate',
    TEMPLATE_UPDATE_SUCCESS: 'EventWorkingListsTemplateUpdateSuccess',
    TEMPLATE_UPDATE_ERROR: 'EventWorkingListsTemplateUpdateError',
    EVENT_LIST_INIT: 'EventWorkingListsEventListInit',
    EVENT_LIST_INIT_SUCCESS: 'EventWorkingListsEventListInitSuccess',
    EVENT_LIST_INIT_ERROR: 'EventWorkingListsEventListInitError',
    EVENT_LIST_INIT_CANCEL: 'EventWorkingListsEventListInitCancel',
    EVENT_LIST_UPDATE: 'EventWorkingListsEventListUpdate',
    EVENT_LIST_UPDATE_SUCCESS: 'EventWorkingListsEventListUpdateSuccess',
    EVENT_LIST_UPDATE_ERROR: 'EventWorkingListsEventListUpdateError',
    EVENT_LIST_UPDATE_CANCEL: 'EventWorkingListsEventListUpdateCancel',
    EVENT_DELETE: 'EventWorkingListsEventListEventDelete',
    EVENT_DELETE_SUCCESS: 'EventWorkingListsEventListEventDeleteSuccess',
    EVENT_DELETE_ERROR: 'EventWorkingListsEventListEventDeleteError',
};

export const batchActionTypes = {
    TEMPLATES_FETCH_SUCCESS_BATCH: 'EventWorkingListTemplatesFetchSuccessBatch', // shouldn't be used eventually
};

export const preCleanData =
    (listId: string) => actionCreator(actionTypes.DATA_PRE_CLEAN)({ listId });

export const fetchTemplates =
    (listId: string) => actionCreator(actionTypes.TEMPLATES_FETCH)({ listId });

export const fetchTemplatesSuccess = (templates: Array<any>, listId: string) =>
    actionCreator(actionTypes.TEMPLATES_FETCH_SUCCESS)({ templates, listId });

export const fetchTemplatesError = (error: string, listId: string) =>
    actionCreator(actionTypes.TEMPLATES_FETCH_ERROR)({ error, listId });

export const fetchTemplatesCancel = (listId: string) =>
    actionCreator(actionTypes.TEMPLATES_FETCH_CANCEL)({ listId });

export const selectTemplate = (templateId: string, listId: string) =>
    actionCreator(actionTypes.TEMPLATE_SELECT)({ templateId, listId });

export const addTemplate = (data: Object) =>
    actionCreator(actionTypes.TEMPLATE_ADD)(data);

export const updateTemplate = (templateId: string, data: Object) =>
    actionCreator(actionTypes.TEMPLATE_UPDATE)({ templateId, ...data });

export const updateTemplateSuccess = (templateId: string) =>
    actionCreator(actionTypes.TEMPLATE_UPDATE_SUCCESS)({ templateId });

export const updateTemplateError = (templateId: string, templateName: string) =>
    actionCreator(actionTypes.TEMPLATE_UPDATE_ERROR)({ templateId, templateName });

export const initEventList =
    (selectedTemplate: Object, defaultConfig: Map<string, Object>, listId: string) => actionCreator(actionTypes.EVENT_LIST_INIT)({ selectedTemplate, defaultConfig, listId });

export const initEventListSuccess =
    (listId: string, data: Object) => actionCreator(actionTypes.EVENT_LIST_INIT_SUCCESS)({ ...data, listId });

export const initEventListError =
    (listId: string, errorMessage: string) => actionCreator(actionTypes.EVENT_LIST_INIT_ERROR)({ listId, errorMessage });

export const initEventListCancel =
    (listId: string) => actionCreator(actionTypes.EVENT_LIST_INIT_CANCEL)({ listId });

export const updateEventList =
    (listId: string, queryArgs: Object) => actionCreator(actionTypes.EVENT_LIST_UPDATE)({ listId, queryArgs });

export const updateEventListSuccess =
    (listId: string, data: Object) => actionCreator(actionTypes.EVENT_LIST_UPDATE_SUCCESS)({ ...data, listId });

export const updateEventListError =
    (listId: string, errorMessage: string) =>
        actionCreator(actionTypes.EVENT_LIST_UPDATE_ERROR)({ listId, errorMessage });

export const updateEventListCancel =
    (listId: string) => actionCreator(actionTypes.EVENT_LIST_UPDATE_CANCEL)({ listId });

export const deleteEvent =
    (eventId: string, listId: string) => actionCreator(actionTypes.EVENT_DELETE)({ listId }, {
        offline: {
            effect: {
                url: `events/${eventId}`,
                method: methods.DELETE,
            },
            commit: { type: actionTypes.EVENT_DELETE_SUCCESS },
            rollback: { type: actionTypes.EVENT_DELETE_ERROR },
        },
    });
