// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    WORKING_LIST_UPDATE_DATA_RETRIEVED: 'WorkingListUpdateDataRetrieved',
    WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED: 'WorkingListUpdateDataRetrievalFailed',
    SORT_WORKING_LIST: 'SortWorkingList',
    OPEN_EDIT_EVENT_PAGE: 'OpenEditEventPage',
};

export const workingListUpdateDataRetrieved =
    (data: Object) => actionCreator(actionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED)(data);

export const workingListUpdateRetrievalFailed =
    (errorMessage: string) => actionCreator(actionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED)(errorMessage);

export const sortWorkingList =
    (id: string, direction: string) => actionCreator(actionTypes.SORT_WORKING_LIST)({ id, direction });

export const openEditEventPage =
    (eventId: string) => actionCreator(actionTypes.OPEN_EDIT_EVENT_PAGE)(eventId);
