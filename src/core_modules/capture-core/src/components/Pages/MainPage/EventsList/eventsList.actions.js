// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    WORKING_LIST_UPDATE_DATA_RETRIEVED: 'WorkingListUpdateDataRetrieved',
    WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED: 'WorkingListUpdateDataRetrievalFailed',
};

export const workingListUpdateDataRetrieved =
    (data: Object) => actionCreator(actionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVED)(data);

export const workingListUpdateRetrievalFailed =
    (errorMessage: string) => actionCreator(actionTypes.WORKING_LIST_UPDATE_DATA_RETRIEVAL_FAILED)(errorMessage);
