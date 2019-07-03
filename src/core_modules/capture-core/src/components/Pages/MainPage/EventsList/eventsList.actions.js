// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';
import { methods } from '../../../../trackerOffline/trackerOfflineConfig.const';

export const actionTypes = {
    WORKING_LIST_UPDATE_DATA_RETRIEVED: 'WorkingListUpdateDataRetrieved',
    WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED: 'WorkingListUpdateDataRetrievalFailed',
    SORT_WORKING_LIST: 'SortWorkingList',
    OPEN_EDIT_EVENT_PAGE: 'OpenEditEventPage',
    OPEN_VIEW_EVENT_PAGE: 'OpenViewEventPage',
    REQUEST_DELETE_EVENT: 'RequestDeleteEvent',
    START_DELETE_EVENT: 'StartDeleteEvent',
    DELETE_EVENT_FAILED: 'DeleteEventFailed',
    EVENT_DELETED: 'EventDeleted',
    WORKING_LIST_UPDATING: 'WorkingListUpdating',
    WORKING_LIST_UPDATING_WITH_DIALOG: 'WorkingListUpdatingWithDialog',

    SET_CURRENT_WORKING_LIST_CONFIG: 'SetCurrentWorkingListConfig',
    WORKING_LIST_CONFIGS_RETRIEVED: 'WorkingListConfigsRetrieved',
    WORKING_LIST_CONFIGS_RETRIEVAL_FAILED: 'WorkingListConfigsRetrievalFailed',
    ADD_WORKING_LIST_CONFIG: 'AddWorkingListConfig',
};

export const batchActionTypes = {
    WORKING_LIST_CONFIGS_RETRIEVED_BATCH: 'WorkingListConfigsRetrievedBatch',
    START_DELETE_EVENT_UPDATE_WORKING_LIST: 'StartDeleteEventUpdateWorkingList',
};

export const workingListUpdateDataRetrieved =
    (listId: string, data: Object) => actionCreator(actionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED)({ ...data, listId });

export const workingListUpdateRetrievalFailed =
    (listId: string, errorMessage: string) => actionCreator(actionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED)({ listId, errorMessage });

export const sortWorkingList =
    (listId: string, id: string, direction: string) => actionCreator(actionTypes.SORT_WORKING_LIST)({ listId, id, direction });

export const workingListUpdating = (listId: string) => actionCreator(actionTypes.WORKING_LIST_UPDATING)({ listId });
export const workingListUpdatingWithDialog =
    (listId: string) => actionCreator(actionTypes.WORKING_LIST_UPDATING_WITH_DIALOG)({ listId });

export const openEditEventPage =
    (eventId: string) => actionCreator(actionTypes.OPEN_EDIT_EVENT_PAGE)(eventId);

export const openViewEventPage =
    (eventId: string) => actionCreator(actionTypes.OPEN_VIEW_EVENT_PAGE)(eventId);

export const requestDeleteEvent = (eventId: string) => actionCreator(actionTypes.REQUEST_DELETE_EVENT)({ eventId });

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

export const workingListConfigsRetrieved = (workingListConfigs: Array<any>) =>
    actionCreator(actionTypes.WORKING_LIST_CONFIGS_RETRIEVED)({ workingListConfigs });

export const workingListConfigsRetrievalFailed = (error: string) =>
    actionCreator(actionTypes.WORKING_LIST_CONFIGS_RETRIEVAL_FAILED)({ error });

export const setCurrentWorkingListConfig = (configId: string, listId: string, data?: ?Object) =>
    actionCreator(actionTypes.SET_CURRENT_WORKING_LIST_CONFIG)({ ...data, configId, listId });

export const addWorkingListConfig = (name: string, description: string) =>
    actionCreator(actionTypes.ADD_WORKING_LIST_CONFIG)({ name, description });
