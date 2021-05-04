// @flow
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { checkForDuplicate, resetCheckForDuplicate } from '../../../../DataEntryUtils';
import { useDuplicates } from '../../../../PossibleDuplicatesDialog/useDuplicates';
import type { InputSearchGroup } from '../../../../../metaData';

export const useDuplicateCheckerOnSaveReduxProvider = (dataEntryId: string, selectedScopeId: string) => {
    const dispatch = useDispatch();
    const orgUnitId = useSelector(({ currentSelections }) => currentSelections.orgUnitId);

    const dispatchCheckForDuplicate = useCallback((searchGroup: InputSearchGroup, scopeContext: Object) =>
        dispatch(checkForDuplicate(dataEntryId, searchGroup, { orgUnitId, ...scopeContext })),
    [dispatch, dataEntryId, orgUnitId]);
    const dispatchResetCheckForDuplicate = useCallback(() => dispatch(resetCheckForDuplicate(dataEntryId)), [dispatch, dataEntryId]);
    const duplicateInfo = useSelector(({ dataEntriesSearchGroupResults }) => dataEntriesSearchGroupResults[dataEntryId]);

    const { onReviewDuplicates } = useDuplicates(dataEntryId, selectedScopeId);

    return {
        onCheckForDuplicate: dispatchCheckForDuplicate,
        onResetCheckForDuplicate: dispatchResetCheckForDuplicate,
        duplicateInfo,
        onReviewDuplicates,
    };
};
