import { actionCreator } from '../../../actions/actions.utils';

export const checkForDuplicateActionTypes = {
    DUPLICATE_CHECK: 'DataEntry.DuplicateCheck',
    DUPLICATE_CHECK_SUCCESS: 'DataEntry.DuplicateCheckSuccess',
    DUPLICATE_CHECK_ERROR: 'DataEntry.DuplicateCheckError',
    DUPLICATE_CHECK_RESET: 'DataEntry.DuplicateCheckReset',
    DUPLICATE_CHECK_CANCEL: 'DataEntry.DuplicateCheckCancel',
};

export const checkForDuplicate = (dataEntryId, searchGroup, searchContext) =>
    actionCreator(checkForDuplicateActionTypes.DUPLICATE_CHECK)({ dataEntryId, searchGroup, searchContext });
export const resetCheckForDuplicate = dataEntryId =>
    actionCreator(checkForDuplicateActionTypes.DUPLICATE_CHECK_RESET)({ dataEntryId });
export const checkForDuplicateSuccess = (dataEntryId, hasDuplicate) =>
    actionCreator(checkForDuplicateActionTypes.DUPLICATE_CHECK_SUCCESS)({ dataEntryId, hasDuplicate });
