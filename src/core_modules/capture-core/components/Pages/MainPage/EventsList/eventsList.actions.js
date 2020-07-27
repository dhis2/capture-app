// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';
import { methods } from '../../../../trackerOffline/trackerOfflineConfig.const';

export const actionTypes = {
    SORT_WORKING_LIST: 'SortWorkingList',
    OPEN_EDIT_EVENT_PAGE: 'OpenEditEventPage',
    OPEN_VIEW_EVENT_PAGE: 'OpenViewEventPage',
    REQUEST_DELETE_EVENT: 'RequestDeleteEvent',
    START_DELETE_EVENT: 'StartDeleteEvent',
    DELETE_EVENT_FAILED: 'DeleteEventFailed',
    EVENT_DELETED: 'EventDeleted',
    WORKING_LIST_UPDATING: 'WorkingListUpdating',
    WORKING_LIST_UPDATING_WITH_DIALOG: 'WorkingListUpdatingWithDialog',
};

export const batchActionTypes = {
    WORKING_LIST_CONFIGS_RETRIEVED_BATCH: 'WorkingListConfigsRetrievedBatch',
    START_DELETE_EVENT_UPDATE_WORKING_LIST: 'StartDeleteEventUpdateWorkingList',
};

export const sortWorkingList =
    (listId: string, id: string, direction: string) => actionCreator(actionTypes.SORT_WORKING_LIST)({ listId, id, direction });

export const workingListUpdating = (listId: string) => actionCreator(actionTypes.WORKING_LIST_UPDATING)({ listId });
// todo not used!
export const workingListUpdatingWithDialog =
    (listId: string) => actionCreator(actionTypes.WORKING_LIST_UPDATING_WITH_DIALOG)({ listId });

export const openEditEventPage =
    (eventId: string) => actionCreator(actionTypes.OPEN_EDIT_EVENT_PAGE)(eventId);

export const openViewEventPage =
    (eventId: string) => actionCreator(actionTypes.OPEN_VIEW_EVENT_PAGE)(eventId);

export const requestDeleteEvent = (eventId: string) => actionCreator(actionTypes.REQUEST_DELETE_EVENT)({ eventId });
// todo not used!
export const startDeleteEvent = (eventId: string) =>
    actionCreator(actionTypes.START_DELETE_EVENT)({}, {
        offline: {
            effect: {
                url: `events/${eventId}`,
                method: methods.DELETE,
            },
            commit: { type: actionTypes.EVENT_DELETED },
            rollback: { type: actionTypes.DELETE_EVENT_FAILED },
        },
    });
