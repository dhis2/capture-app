import { actionCreator } from '../../../actions/actions.utils';

export const checkForDuplicateActionTypes = {
    DUPLICATE_CHECK: 'DataEntry.DuplicateCheck',
    DUPLICATE_CHECK_SUCCESS: 'DataEntry.DuplicateCheckSuccess',
    DUPLICATE_CHECK_ERROR: 'DataEntry.DuplicateCheckError',
    DUPLICATE_CHECK_RESET: 'DataEntry.DuplicateCheckReset',
};

export const checkForDuplicate = (dataEntryId, searchGroup, searchContext) =>
    actionCreator(checkForDuplicateActionTypes.DUPLICATE_CHECK)({ dataEntryId, searchGroup, searchContext });

export const checkForDuplicateSuccess = (dataEntryId, hasDuplicate) =>
    actionCreator(checkForDuplicateActionTypes.DUPLICATE_CHECK_SUCCESS)({ dataEntryId, hasDuplicate });

export const checkForDuplicateError = dataEntryId =>
    actionCreator(checkForDuplicateActionTypes.DUPLICATE_CHECK_ERROR)({ dataEntryId });

export const resetCheckForDuplicate = dataEntryId =>
    actionCreator(checkForDuplicateActionTypes.DUPLICATE_CHECK_RESET)({ dataEntryId });
