// @flow
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
    TEMPLATE_ADD_SKIP_INIT_CLEAN: 'EventWorkingListsTemplateAddSkipInitClean',
    TEMPLATE_DELETE: 'EventWorkingListsTemplateDelete',
    TEMPLATE_DELETE_SUCCESS: 'EventWorkingListsTemplateDeleteSuccess',
    TEMPLATE_DELETE_ERROR: 'EventWorkingListsTemplateDeleteError',
    TEMPLATE_UPDATE: 'EventWorkingListsTemplateUpdate',
    TEMPLATE_UPDATE_SUCCESS: 'EventWorkingListsTemplateUpdateSuccess',
    TEMPLATE_UPDATE_ERROR: 'EventWorkingListsTemplateUpdateError',
    LIST_VIEW_INIT: 'WorkingListsListViewInit',
    LIST_VIEW_INIT_SUCCESS: 'WorkingListsListViewInitSuccess',
    LIST_VIEW_INIT_ERROR: 'WorkingListsListViewInitError',
    LIST_VIEW_INIT_CANCEL: 'WorkingListsListViewInitCancel',
    LIST_UPDATE: 'WorkingListsListUpdate',
    LIST_UPDATE_SUCCESS: 'WorkingListsListUpdateSuccess',
    LIST_UPDATE_ERROR: 'WorkingListsListUpdateError',
    LIST_UPDATE_CANCEL: 'WorkingListsListUpdateCancel',
    EVENT_DELETE: 'EventWorkingListsEventListEventDelete',
    EVENT_DELETE_SUCCESS: 'EventWorkingListsEventListEventDeleteSuccess',
    EVENT_DELETE_ERROR: 'EventWorkingListsEventListEventDeleteError',
    CONTEXT_UNLOADING: 'EventWorkingListsContextUnloading',
    VIEW_EVENT_PAGE_OPEN: 'ViewEventPageOpen',
    EVENT_REQUEST_DELETE: 'EventWorkingListsEventDelete',
};

export const batchActionTypes = {
    TEMPLATES_FETCH_SUCCESS_BATCH: 'EventWorkingListTemplatesFetchSuccessBatch', // shouldn't be used eventually
};

export const preCleanData =
    (cleanTemplates: boolean, listId: string) =>
        actionCreator(actionTypes.DATA_PRE_CLEAN)({ cleanTemplates, listId });

export const fetchTemplates =
    (programId: string, listId: string) => actionCreator(actionTypes.TEMPLATES_FETCH)({ programId, listId });

export const fetchTemplatesSuccess = (templates: Array<any>, programId: string, listId: string) =>
    actionCreator(actionTypes.TEMPLATES_FETCH_SUCCESS)({ templates, programId, listId });

export const fetchTemplatesError = (error: string, listId: string) =>
    actionCreator(actionTypes.TEMPLATES_FETCH_ERROR)({ error, listId });

export const fetchTemplatesCancel = (listId: string) =>
    actionCreator(actionTypes.TEMPLATES_FETCH_CANCEL)({ listId });

export const selectTemplate = (templateId: string, listId: string) =>
    actionCreator(actionTypes.TEMPLATE_SELECT)({ templateId, listId });

export const updateTemplate = (template: Object, eventQueryCriteria: Object, data: Object) =>
    actionCreator(actionTypes.TEMPLATE_UPDATE)({ template, eventQueryCriteria, ...data });

export const updateTemplateSuccess = (templateId: string, eventQueryCriteria: Object, data: Object) =>
    actionCreator(actionTypes.TEMPLATE_UPDATE_SUCCESS)({ templateId, eventQueryCriteria, ...data });

export const updateTemplateError = (templateId: string, eventQueryCriteria: Object, data: Object) =>
    actionCreator(actionTypes.TEMPLATE_UPDATE_ERROR)({ templateId, eventQueryCriteria, ...data });

export const addTemplate = (name: string, eventQueryCriteria: Object, data: Object) =>
    actionCreator(actionTypes.TEMPLATE_ADD)({ name, eventQueryCriteria, ...data });

export const addTemplateSuccess = (templateId: string, clientId: Object, data: Object) =>
    actionCreator(actionTypes.TEMPLATE_ADD_SUCCESS)({ templateId, clientId, ...data });

export const addTemplateError = (clientId: Object, data: Object) =>
    actionCreator(actionTypes.TEMPLATE_ADD_ERROR)({ clientId, ...data });

export const cleanSkipInitAddingTemplate = (template: Object, listId: string) =>
    actionCreator(actionTypes.TEMPLATE_ADD_SKIP_INIT_CLEAN)({ template, listId });

export const deleteTemplate = (template: Object, programId: string, listId: string) =>
    actionCreator(actionTypes.TEMPLATE_DELETE)({ template, programId, listId });

export const deleteTemplateSuccess = (template: Object, listId: string) =>
    actionCreator(actionTypes.TEMPLATE_DELETE_SUCCESS)({ template, listId });

export const deleteTemplateError = (template: Object, listId: string) =>
    actionCreator(actionTypes.TEMPLATE_DELETE_ERROR)({ template, listId });

export const initListView =
    (selectedTemplate: Object, context: Object, meta: Object) =>
        actionCreator(actionTypes.LIST_VIEW_INIT)({ ...meta, selectedTemplate, context });

export const initListViewSuccess =
    (listId: string, data: Object) => actionCreator(actionTypes.LIST_VIEW_INIT_SUCCESS)({ ...data, listId });

export const initListViewError =
    (listId: string, errorMessage: string) =>
        actionCreator(actionTypes.LIST_VIEW_INIT_ERROR)({ listId, errorMessage });

export const initListViewCancel =
    (listId: string) => actionCreator(actionTypes.LIST_VIEW_INIT_CANCEL)({ listId });

export const updateList =
    (queryArgs: Object, meta: Object) => actionCreator(actionTypes.LIST_UPDATE)({ queryArgs, ...meta });

export const updateListSuccess =
    (listId: string, data: Object) => actionCreator(actionTypes.LIST_UPDATE_SUCCESS)({ ...data, listId });

export const updateListError =
    (listId: string, errorMessage: string) =>
        actionCreator(actionTypes.LIST_UPDATE_ERROR)({ listId, errorMessage });

export const updateListCancel =
    (listId: string) => actionCreator(actionTypes.LIST_UPDATE_CANCEL)({ listId });

export const deleteEventSuccess =
    (eventId: string, listId: string) => actionCreator(actionTypes.EVENT_DELETE_SUCCESS)({ eventId, listId });

export const deleteEventError =
    () => actionCreator(actionTypes.EVENT_DELETE_ERROR)();

export const unloadingContext = (listId: string) => actionCreator(actionTypes.CONTEXT_UNLOADING)({ listId });

export const openViewEventPage =
    (eventId: string) => actionCreator(actionTypes.VIEW_EVENT_PAGE_OPEN)(eventId);

export const requestDeleteEvent = (eventId: string) => actionCreator(actionTypes.EVENT_REQUEST_DELETE)({ eventId });
