// @flow
import { createReducerDescription } from '../../../trackerRedux';
import { checkForDuplicateActionTypes } from './checkForDuplicate.actions';

export const dataEntriesSearchGroupResultsReducerDesc = createReducerDescription({
    [checkForDuplicateActionTypes.DUPLICATE_CHECK_SUCCESS]: (state, { payload: { dataEntryId, hasDuplicate } }) => ({
        ...state,
        [dataEntryId]: {
            hasDuplicate,
        },
    }),
    [checkForDuplicateActionTypes.DUPLICATE_CHECK_ERROR]: (state, { payload: { dataEntryId } }) => ({
        ...state,
        [dataEntryId]: {
            hasDuplicate: false,
        },
    }),
    [checkForDuplicateActionTypes.DUPLICATE_CHECK_RESET]: (state, { payload: { dataEntryId } }) =>
        Object
            .keys(state)
            .reduce((acc, key) => {
                if (key !== dataEntryId) {
                    acc[key] = state[key];
                }
                return acc;
            }, {}),
}, 'dataEntriesSearchGroupResults', {});
