// @flow
import { useDispatch } from 'react-redux';
import { useCallback, useContext } from 'react';
import { ResultsPageSizeContext } from '../Pages/shared-contexts';
import { useScopeInfo } from '../../hooks/useScopeInfo';
import { useCurrentOrgUnitInfo } from '../../hooks/useCurrentOrgUnitInfo';
import { changePage, reviewDuplicates } from './possibleDuplicatesDialog.actions';

export const useDuplicates = (dataEntryId: string, selectedScopeId: string) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);
    const dispatch = useDispatch();
    const { scopeType } = useScopeInfo(selectedScopeId);
    const { id: orgUnitId } = useCurrentOrgUnitInfo();
    const dispatchOnReviewDuplicates = useCallback(
        () => {
            dispatch(
                reviewDuplicates({
                    pageSize: resultsPageSize,
                    orgUnitId,
                    selectedScopeId,
                    scopeType,
                    dataEntryId,
                }));
        },
        [dispatch, orgUnitId, selectedScopeId, scopeType, dataEntryId, resultsPageSize]);

    const dispatchPageChangeOnReviewDuplicates = useCallback(
        (page: number) => {
            dispatch(
                changePage({
                    page,
                    pageSize: resultsPageSize,
                    orgUnitId,
                    selectedScopeId,
                    scopeType,
                    dataEntryId,
                }));
        },
        [dispatch, orgUnitId, selectedScopeId, scopeType, dataEntryId, resultsPageSize]);

    return {
        onReviewDuplicates: dispatchOnReviewDuplicates,
        changePageOnReviewDuplicates: dispatchPageChangeOnReviewDuplicates,
    };
};
