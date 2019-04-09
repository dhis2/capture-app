// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const actionTypes = {
    EDIT_CONTENTS: 'EditFilterSelectorContentsForWorkingList',
    SET_FILTER: 'SetWorkingListFilter',
    CLEAR_FILTER: 'ClearWorkingListFilter',
    REVERT_FILTER: 'RevertWorkingListFilter',
    REST_MENU_ITEM_SELECTED: 'RestMenuItemSelected',
    UPDATE_INCLUDED_FILTERS_AFTER_COLUMN_SORTING: 'UpdateIncludedFiltersAfterColumnSortingForWorkingList',
};

export const batchActionTypes = {
    SET_FILTER_BATCH: 'SetFilterBatch',
};

export const editContents = (listId: string, value: any, itemId: string) =>
    actionCreator(actionTypes.EDIT_CONTENTS)({ listId, value, itemId });

export const setFilter = (listId: string, data: Object, itemId: string) =>
    actionCreator(actionTypes.SET_FILTER)({ ...data, itemId, listId });

export const clearFilter = (listId: string, itemId: string) =>
    actionCreator(actionTypes.CLEAR_FILTER)({ listId, itemId });

export const revertFilter = (listId: string) =>
    actionCreator(actionTypes.REVERT_FILTER)({ listId });

export const restMenuItemSelected = (id: string) =>
    actionCreator(actionTypes.REST_MENU_ITEM_SELECTED)({ id });

export const updateIncludedFiltersAfterColumnSorting = (includeFilters: Object) =>
    actionCreator(actionTypes.UPDATE_INCLUDED_FILTERS_AFTER_COLUMN_SORTING)({ includeFilters });
