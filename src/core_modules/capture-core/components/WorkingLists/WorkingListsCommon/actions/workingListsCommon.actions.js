// @flow
import { actionCreator } from '../../../../actions/actions.utils';
import type {
    SharingSettings,
} from '../../WorkingListsBase';

export const workingListsCommonActionTypesBatchActionTypes = {
    TEMPLATE_ADD_SUCCESS: 'WorkingListsTemplateAddSuccessBatchAction',
};

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
    TEMPLATE_DEFAULT_UPDATE: 'WorkingListsTemplateDefaultUpdate',
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
    LIST_COLUMN_ORDER_RESET: 'WorkingListsListColumnOrderReset',
    FILTER_SET: 'WorkingListsFilterSet',
    FILTER_REMOVE: 'WorkingListsFilterRemove',
    FILTER_CLEAR: 'WorkingListsFilterClear',
    FILTERS_CLEAR: 'WorkingListsFiltersClear',
    REST_MENU_ITEM_SELECT: 'WorkingListsRestMenuItemSelect',
    STICKY_FILTERS_AFTER_COLUMN_SORTING_SET: 'WorkingListsStickyFiltersAfterColumnSortingSet',
    PAGE_CHANGE: 'WorkingListsPageChange',
    ROWS_PER_PAGE_CHANGE: 'WorkingListsRowsPerPageChange',
    TEMPLATE_SHARING_SETTINGS_SET: 'WorkingListsTemplateSharingSettingsSet',
};

export const fetchTemplates = (
    programId: string,
    storeId: string,
    workingListsType: string,
    selectedTemplateId?: string,
) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATES_FETCH)({
        programId,
        storeId,
        selectedTemplateId,
        workingListsType,
    });

export const fetchTemplatesSuccess = (templates: Array<any>, defaultTemplateId: string, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATES_FETCH_SUCCESS)({ templates, defaultTemplateId, storeId });

export const fetchTemplatesError = (error: string, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATES_FETCH_ERROR)({ error, storeId });

export const fetchTemplatesCancel = (storeId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATES_FETCH_CANCEL)({ storeId });

export const selectTemplate = (templateId: string, storeId: string, programStageId?: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_SELECT)({ templateId, storeId, programStageId });

export const updateTemplate = (template: Object, criteria: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_UPDATE)({ template, criteria, ...data });

export const updateTemplateSuccess = (templateId: string, criteria: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_UPDATE_SUCCESS)({ templateId, criteria, ...data });

export const updateTemplateError = (templateId: string, criteria: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_UPDATE_ERROR)({ templateId, criteria, ...data });

export const addTemplate = (name: string, criteria: Object, data: Object, callBacks?: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_ADD)({ name, criteria, ...data, callBacks });

export const addTemplateSuccess = (templateId: string, clientId: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_ADD_SUCCESS)({ templateId, clientId, ...data });

export const addTemplateError = (clientId: Object, data: Object) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_ADD_ERROR)({ clientId, ...data });

export const deleteTemplate = (
    template: Object,
    programId: string,
    { storeId, workingListsType, programStageId }: { storeId: string, workingListsType: string, programStageId?: string },
    callBacks?: Object,
) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_DELETE)({
        template,
        programId,
        storeId,
        workingListsType,
        callBacks,
        programStageId,
    });

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

export const resetListColumnOrder = (storeId: string) =>
    actionCreator(workingListsCommonActionTypes.LIST_COLUMN_ORDER_RESET)({ storeId }, { skipLogging: ['columns'] });

export const setFilter = (filter: Object, itemId: string, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.FILTER_SET)({ filter, itemId, storeId });

export const removeFilter = (itemId: string, includeFilters: Object, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.FILTER_REMOVE)({ itemId, includeFilters, storeId });

export const clearFilter = (itemId: string, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.FILTER_CLEAR)({ itemId, storeId });

export const clearFilters = (filtersList: Array<string>, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.FILTERS_CLEAR)({ filtersList, storeId });

export const selectRestMenuItem = (id: string, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.REST_MENU_ITEM_SELECT)({ id, storeId });

export const setStickyFiltersAfterColumnSorting = (includeFilters: Object, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.STICKY_FILTERS_AFTER_COLUMN_SORTING_SET)({ includeFilters, storeId });

export const changePage = (pageNumber: number, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.PAGE_CHANGE)({ pageNumber, storeId });

export const changeRowsPerPage = (rowsPerPage: number, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.ROWS_PER_PAGE_CHANGE)({ rowsPerPage, storeId });

export const setTemplateSharingSettings = (sharingSettings: SharingSettings, templateId: string, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_SHARING_SETTINGS_SET)({ sharingSettings, templateId, storeId });

export const updateDefaultTemplate = (defaultTemplate: Object, storeId: string) =>
    actionCreator(workingListsCommonActionTypes.TEMPLATE_DEFAULT_UPDATE)({ defaultTemplate, storeId });
