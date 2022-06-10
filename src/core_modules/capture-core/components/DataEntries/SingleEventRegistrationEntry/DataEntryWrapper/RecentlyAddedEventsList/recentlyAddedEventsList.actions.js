// @flow
import { actionCreator } from '../../../../../actions/actions.utils';

export const recentlyAddedEventsActionTypes = {
    NEW_RECENTLY_ADDED_EVENT: 'newRecentlyAddedEvent',
    LIST_ITEM_PREPEND: 'ListItemPrepend',
    LIST_ITEM_APPEND: 'ListItemAppend',
    LIST_ITEM_REMOVE: 'ListItemRemove',
    LIST_RESET: 'ListReset',
};

// $FlowFixMe[missing-annot] automated comment
export const newRecentlyAddedEvent = (event, eventValues, programId) =>
    actionCreator(recentlyAddedEventsActionTypes.NEW_RECENTLY_ADDED_EVENT)({ event, eventValues, programId });

export const prependListItem =
    (listId: string, itemId: string, programId: string) =>
        actionCreator(recentlyAddedEventsActionTypes.LIST_ITEM_PREPEND)({ listId, itemId, programId });

export const removeListItem =
    (listId: string, itemId: string) =>
        actionCreator(recentlyAddedEventsActionTypes.LIST_ITEM_REMOVE)({ listId, itemId });

export const resetList =
    (listId: string, columnOrder: any, meta: any, selections: any, programId: string) =>
        actionCreator(recentlyAddedEventsActionTypes.LIST_RESET)({ listId, columnOrder, meta, selections, programId });
