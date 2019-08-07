// @flow
import { actionCreator } from '../../actions/actions.utils';

export const actionTypes = {
    APPEND_LIST_ITEM: 'AppendListItem',
    PREPEND_LIST_ITEM: 'PrependListItem',
    REMOVE_LIST_ITEM: 'removeListItem',
    RESET_LIST: 'resetList',
};

export const prependListItem =
    (listId: string, itemId: string) =>
        actionCreator(actionTypes.PREPEND_LIST_ITEM)({ listId, itemId });

export const appendListItem =
    (listId: string, itemId: string) =>
        actionCreator(actionTypes.APPEND_LIST_ITEM)({ listId, itemId });

export const removeListItem =
    (listId: string, itemId: string) =>
        actionCreator(actionTypes.REMOVE_LIST_ITEM)({ listId, itemId });

export const resetList =
    (listId: string, columnOrder: any, meta: any, selections: any) =>
        actionCreator(actionTypes.RESET_LIST)({ listId, columnOrder, meta, selections });
