// @flow
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useDuplicates, duplicatesReset } from '../../../../PossibleDuplicatesDialog';


export const useDuplicateCheckerOnSaveReduxProvider = (dataEntryId: string, selectedScopeId: string) => {
    const dispatch = useDispatch();
    const dispatchDuplicatesReset = useCallback(() => dispatch(duplicatesReset()), [dispatch]);
    const hasDuplicate = useSelector(
        ({ possibleDuplicates: { isLoading, teis } }) => (isLoading ? undefined : teis?.length > 0),
    );
    const { onReviewDuplicates } = useDuplicates(dataEntryId, selectedScopeId);

    return {
        onResetPossibleDuplicates: dispatchDuplicatesReset,
        hasDuplicate,
        onReviewDuplicates,
    };
};
