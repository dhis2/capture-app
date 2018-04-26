// @flow
import { actionCreator } from 'capture-core/actions/actions.utils';

export const actionTypes = {
    UPDATE_MAIN_SELECTIONS: 'UpdateMainSelections',
    MAIN_SELECTIONS_COMPLETED: 'MainSelectionsCompleted',
    WORKING_LIST_DATA_RETRIEVED: 'WorkingListDataRetrieved',
    WORKING_LIST_DATA_RETRIEVAL_FAILED: 'WorkingListDataRetrievalFailed',
};

export const updateMainSelections =
    (selections: Object) => actionCreator(actionTypes.UPDATE_MAIN_SELECTIONS)(selections);

export const mainSelectionCompleted =
    () => actionCreator(actionTypes.MAIN_SELECTIONS_COMPLETED)();

export const workingListInitialDataRetrieved =
    (data: Object) => actionCreator(actionTypes.WORKING_LIST_DATA_RETRIEVED)(data);

export const workingListInitialRetrievalFailed =
    (errorMessage: string) => actionCreator(actionTypes.WORKING_LIST_DATA_RETRIEVAL_FAILED)(errorMessage);
