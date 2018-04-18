// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    UPDATE_MAIN_SELECTIONS: 'UpdateMainSelections',
    WORKING_LIST_DATA_RETRIEVED: 'WorkingListDataRetrieved',
    WORKING_LIST_DATA_RETRIEVAL_FAILED: 'WorkingListDataRetrievalFailed',
};

export const updateMainSelections =
    (selections: Object) => actionCreator(actionTypes.UPDATE_MAIN_SELECTIONS)(selections);

export const workingListDataRetrieved =
    (data: Object) => actionCreator(actionTypes.WORKING_LIST_DATA_RETRIEVED)(data);

export const workingListRetrievalFailed =
    (errorMessage: string) => actionCreator(actionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED)(errorMessage);
