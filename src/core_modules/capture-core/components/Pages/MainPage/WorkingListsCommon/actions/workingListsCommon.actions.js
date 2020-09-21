// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const workingListsCommonActionTypes = {
    LIST_SORT: 'WorkingListsListSort',
    LIST_COLUMN_ORDER_SET: 'WorkingListsListColumnOrderSet',
    FILTER_SET: 'WorkingListsFilterSet',
    FILTER_CLEAR: 'WorkingListsFilterClear',
    REST_MENU_ITEM_SELECTED: 'RestMenuItemSelected',
    STICKY_FILTERS_AFTER_COLUMN_SORTING_SET: 'StickyFiltersAfterColumnSortingSet',
    PAGE_CHANGE: 'PageChange',
    ROWS_PER_PAGE_CHANGE: 'RowsPerPageChange',
};

export const sortList = (id: string, direction: string, listId: string) =>
    actionCreator(workingListsCommonActionTypes.LIST_SORT)({ id, direction, listId });

export const setListColumnOrder =
    (columns: Array<Object>, listId: string) =>
        actionCreator(workingListsCommonActionTypes.LIST_COLUMN_ORDER_SET)({ columns, listId }, { skipLogging: ['columns'] });

export const setFilter = (filter: Object, itemId: string, listId: string) =>
    actionCreator(workingListsCommonActionTypes.FILTER_SET)({ filter, itemId, listId });

export const clearFilter = (itemId: string, listId: string) =>
    actionCreator(workingListsCommonActionTypes.FILTER_CLEAR)({ itemId, listId });

export const restMenuItemSelected = (id: string, listId: string) =>
    actionCreator(workingListsCommonActionTypes.REST_MENU_ITEM_SELECTED)({ id, listId });

export const setStickyFiltersAfterColumnSorting = (includeFilters: Object, listId: string) =>
    actionCreator(workingListsCommonActionTypes.STICKY_FILTERS_AFTER_COLUMN_SORTING_SET)({ includeFilters, listId });

export const changePage =
    (pageNumber: number, listId: string) =>
        actionCreator(workingListsCommonActionTypes.PAGE_CHANGE)({ pageNumber, listId });

export const changeRowsPerPage =
    (rowsPerPage: number, listId: string) =>
        actionCreator(workingListsCommonActionTypes.ROWS_PER_PAGE_CHANGE)({ rowsPerPage, listId });
