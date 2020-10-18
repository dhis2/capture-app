// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const workingListsCommonActionTypes = {
    TEMPLATES_FETCH: 'WorkingListsTemplatesFetch',
    TEMPLATES_FETCH_SUCCESS: 'WorkingListsTemplatesFetchSuccess',
    TEMPLATES_FETCH_ERROR: 'WorkingListsTemplatesFetchError',
    TEMPLATES_FETCH_CANCEL: 'WorkingListsTemplatesFetchCancel',
    TEMPLATE_SELECT: 'WorkingListsTemplateSelect',
    TEMPLATE_ADD: 'WorkingListsTemplateAdd',
    TEMPLATE_ADD_SUCCESS: 'WorkingListsTemplateAddSuccess',
    TEMPLATE_ADD_ERROR: 'WorkingListsTemplateAddError',
    TEMPLATE_ADD_SKIP_INIT_CLEAN: 'WorkingListsTemplateAddSkipInitClean',
    TEMPLATE_DELETE: 'WorkingListsTemplateDelete',
    TEMPLATE_DELETE_SUCCESS: 'WorkingListsTemplateDeleteSuccess',
    TEMPLATE_DELETE_ERROR: 'WorkingListsTemplateDeleteError',
    TEMPLATE_UPDATE: 'WorkingListsTemplateUpdate',
    TEMPLATE_UPDATE_SUCCESS: 'WorkingListsTemplateUpdateSuccess',
    TEMPLATE_UPDATE_ERROR: 'WorkingListsTemplateUpdateError',
    LIST_VIEW_INIT: 'WorkingListsListViewInit',
    LIST_VIEW_INIT_SUCCESS: 'WorkingListsListViewInitSuccess',
    LIST_VIEW_INIT_ERROR: 'WorkingListsListViewInitError',
    LIST_VIEW_INIT_CANCEL: 'WorkingListsListViewInitCancel',
    LIST_UPDATE: 'WorkingListsListUpdate',
    LIST_UPDATE_SUCCESS: 'WorkingListsListUpdateSuccess',
    LIST_UPDATE_ERROR: 'WorkingListsListUpdateError',
    LIST_UPDATE_CANCEL: 'WorkingListsListUpdateCancel',
    CONTEXT_UNLOADING: 'WorkingListsContextUnloading',

    LIST_SORT: 'WorkingListsListSort',
    LIST_COLUMN_ORDER_SET: 'WorkingListsListColumnOrderSet',
    FILTER_SET: 'WorkingListsFilterSet',
    FILTER_CLEAR: 'WorkingListsFilterClear',
    REST_MENU_ITEM_SELECTED: 'WorkingListsRestMenuItemSelected',
    STICKY_FILTERS_AFTER_COLUMN_SORTING_SET: 'WorkingListsStickyFiltersAfterColumnSortingSet',
    PAGE_CHANGE: 'WorkingListsPageChange',
    ROWS_PER_PAGE_CHANGE: 'WorkingListsRowsPerPageChange',
};

export const batchActionTypes = {
    TEMPLATES_FETCH_SUCCESS_BATCH: 'EventWorkingListTemplatesFetchSuccessBatch', // TODO: shouldn't be used eventually
};

export const fetchTemplates =
    (programId: string, listId: string) =>
        actionCreator(workingListsCommonActionTypes.TEMPLATES_FETCH)({ programId, listId });

export const fetchTemplatesSuccess = (templates: Array<any>, programId: string, listId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATES_FETCH_SUCCESS)({ templates, programId, listId });

export const fetchTemplatesError = (error: string, listId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATES_FETCH_ERROR)({ error, listId });

export const fetchTemplatesCancel = (listId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATES_FETCH_CANCEL)({ listId });

export const selectTemplate = (templateId: string, listId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_SELECT)({ templateId, listId });

export const updateTemplate = (template: Object, eventQueryCriteria: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_UPDATE)({ template, eventQueryCriteria, ...data });

export const updateTemplateSuccess = (templateId: string, eventQueryCriteria: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_UPDATE_SUCCESS)({ templateId, eventQueryCriteria, ...data });

export const updateTemplateError = (templateId: string, eventQueryCriteria: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_UPDATE_ERROR)({ templateId, eventQueryCriteria, ...data });

export const addTemplate = (name: string, eventQueryCriteria: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_ADD)({ name, eventQueryCriteria, ...data });

export const addTemplateSuccess = (templateId: string, clientId: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_ADD_SUCCESS)({ templateId, clientId, ...data });

export const addTemplateError = (clientId: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_ADD_ERROR)({ clientId, ...data });

export const cleanSkipInitAddingTemplate = (template: Object, listId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_ADD_SKIP_INIT_CLEAN)({ template, listId });

export const deleteTemplate = (template: Object, programId: string, listId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_DELETE)({ template, programId, listId });

export const deleteTemplateSuccess = (template: Object, listId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_DELETE_SUCCESS)({ template, listId });

export const deleteTemplateError = (template: Object, listId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_DELETE_ERROR)({ template, listId });

export const initListView = (selectedTemplate: Object, context: Object, meta: Object) =>
    actionCreator(workingListsCommonActionTypes.LIST_VIEW_INIT)({ ...meta, selectedTemplate, context });

export const initListViewSuccess = (listId: string, data: Object) =>
    actionCreator(workingListsCommonActionTypes.LIST_VIEW_INIT_SUCCESS)({ ...data, listId });

export const initListViewError = (listId: string, errorMessage: string) =>
    actionCreator(workingListsCommonActionTypes.LIST_VIEW_INIT_ERROR)({ listId, errorMessage });

export const initListViewCancel =
    (listId: string) => actionCreator(workingListsCommonActionTypes.LIST_VIEW_INIT_CANCEL)({ listId });

export const updateList = (queryArgs: Object, meta: Object) =>
    actionCreator(workingListsCommonActionTypes.LIST_UPDATE)({ queryArgs, ...meta });

export const updateListSuccess = (listId: string, data: Object) =>
    actionCreator(workingListsCommonActionTypes.LIST_UPDATE_SUCCESS)({ ...data, listId });

export const updateListError = (listId: string, errorMessage: string) =>
    actionCreator(workingListsCommonActionTypes.LIST_UPDATE_ERROR)({ listId, errorMessage });

export const updateListCancel = (listId: string) =>
    actionCreator(workingListsCommonActionTypes.LIST_UPDATE_CANCEL)({ listId });

export const unloadingContext = (listId: string) =>
    actionCreator(workingListsCommonActionTypes.CONTEXT_UNLOADING)({ listId });

export const sortList = (id: string, direction: string, listId: string) =>
    actionCreator(workingListsCommonActionTypes.LIST_SORT)({ id, direction, listId });

export const setListColumnOrder = (columns: Array<Object>, listId: string) =>
    actionCreator(workingListsCommonActionTypes.LIST_COLUMN_ORDER_SET)({ columns, listId }, { skipLogging: ['columns'] });

export const setFilter = (filter: Object, itemId: string, listId: string) =>
    actionCreator(workingListsCommonActionTypes.FILTER_SET)({ filter, itemId, listId });

export const clearFilter = (itemId: string, listId: string) =>
    actionCreator(workingListsCommonActionTypes.FILTER_CLEAR)({ itemId, listId });

export const restMenuItemSelected = (id: string, listId: string) =>
    actionCreator(workingListsCommonActionTypes.REST_MENU_ITEM_SELECTED)({ id, listId });

export const setStickyFiltersAfterColumnSorting = (includeFilters: Object, listId: string) =>
    actionCreator(workingListsCommonActionTypes.STICKY_FILTERS_AFTER_COLUMN_SORTING_SET)({ includeFilters, listId });

export const changePage = (pageNumber: number, listId: string) =>
    actionCreator(workingListsCommonActionTypes.PAGE_CHANGE)({ pageNumber, listId });

export const changeRowsPerPage = (rowsPerPage: number, listId: string) =>
    actionCreator(workingListsCommonActionTypes.ROWS_PER_PAGE_CHANGE)({ rowsPerPage, listId });
