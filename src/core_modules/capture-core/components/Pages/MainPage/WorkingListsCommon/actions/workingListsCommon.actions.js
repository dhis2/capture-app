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

export const fetchTemplates =
    (programId: string, storeId: string, workingListsType: string) =>
        actionCreator(workingListsCommonActionTypes.TEMPLATES_FETCH)({ programId, storeId, workingListsType });

export const fetchTemplatesSuccess = (templates: Array<any>, defaultTemplateId: string, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATES_FETCH_SUCCESS)({ templates, defaultTemplateId, storeId });

export const fetchTemplatesError = (error: string, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATES_FETCH_ERROR)({ error, storeId });

export const fetchTemplatesCancel = (storeId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATES_FETCH_CANCEL)({ storeId });

export const selectTemplate = (templateId: string, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_SELECT)({ templateId, storeId });

export const updateTemplate = (template: Object, criteria: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_UPDATE)({ template, criteria, ...data });

export const updateTemplateSuccess = (templateId: string, criteria: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_UPDATE_SUCCESS)({ templateId, criteria, ...data });

export const updateTemplateError = (templateId: string, criteria: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_UPDATE_ERROR)({ templateId, criteria, ...data });

export const addTemplate = (name: string, criteria: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_ADD)({ name, criteria, ...data });

export const addTemplateSuccess = (templateId: string, clientId: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_ADD_SUCCESS)({ templateId, clientId, ...data });

export const addTemplateError = (clientId: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_ADD_ERROR)({ clientId, ...data });

export const deleteTemplate = (
    template: Object,
    programId: string,
    { storeId, workingListsType }: { storeId: string, workingListsType: string}) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_DELETE)({ template, programId, storeId, workingListsType });

export const deleteTemplateSuccess = (template: Object, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_DELETE_SUCCESS)({ template, storeId });

export const deleteTemplateError = (template: Object, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_DELETE_ERROR)({ template, storeId });

export const initListView = (selectedTemplate: Object, context: Object, meta: Object) =>
    actionCreator(workingListsCommonActionTypes.LIST_VIEW_INIT)({ ...meta, selectedTemplate, context });

export const initListViewSuccess = (storeId: string, data: Object) =>
    actionCreator(workingListsCommonActionTypes.LIST_VIEW_INIT_SUCCESS)({ ...data, storeId });

export const initListViewError = (storeId: string, errorMessage: string) =>
    actionCreator(workingListsCommonActionTypes.LIST_VIEW_INIT_ERROR)({ storeId, errorMessage });

export const initListViewCancel =
    (storeId: string) => actionCreator(workingListsCommonActionTypes.LIST_VIEW_INIT_CANCEL)({ storeId });

export const updateList = (queryArgs: Object, meta: Object) =>
    actionCreator(workingListsCommonActionTypes.LIST_UPDATE)({ queryArgs, ...meta });

export const updateListSuccess = (storeId: string, data: Object) =>
    actionCreator(workingListsCommonActionTypes.LIST_UPDATE_SUCCESS)({ ...data, storeId });

export const updateListError = (storeId: string, errorMessage: string) =>
    actionCreator(workingListsCommonActionTypes.LIST_UPDATE_ERROR)({ storeId, errorMessage });

export const updateListCancel = (storeId: string) =>
    actionCreator(workingListsCommonActionTypes.LIST_UPDATE_CANCEL)({ storeId });

export const unloadingContext = (storeId: string) =>
    actionCreator(workingListsCommonActionTypes.CONTEXT_UNLOADING)({ storeId });

export const sortList = (id: string, direction: string, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.LIST_SORT)({ id, direction, storeId });

export const setListColumnOrder = (columns: Array<Object>, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.LIST_COLUMN_ORDER_SET)({ columns, storeId }, { skipLogging: ['columns'] });

export const setFilter = (filter: Object, itemId: string, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.FILTER_SET)({ filter, itemId, storeId });

export const clearFilter = (itemId: string, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.FILTER_CLEAR)({ itemId, storeId });

export const restMenuItemSelected = (id: string, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.REST_MENU_ITEM_SELECTED)({ id, storeId });

export const setStickyFiltersAfterColumnSorting = (includeFilters: Object, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.STICKY_FILTERS_AFTER_COLUMN_SORTING_SET)({ includeFilters, storeId });

export const changePage = (pageNumber: number, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.PAGE_CHANGE)({ pageNumber, storeId });

export const changeRowsPerPage = (rowsPerPage: number, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.ROWS_PER_PAGE_CHANGE)({ rowsPerPage, storeId });
