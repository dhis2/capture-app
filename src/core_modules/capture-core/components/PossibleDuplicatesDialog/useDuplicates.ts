import { useDispatch } from 'react-redux';
import { useCallback, useContext } from 'react';
import { useCurrentOrgUnitId } from '../../hooks/useCurrentOrgUnitId';
import { changePage, reviewDuplicates } from './possibleDuplicatesDialog.actions';
import { ResultsPageSizeContext } from '../Pages/shared-contexts';
import { useScopeInfo } from '../../hooks/useScopeInfo';

type ResultsPageSizeContextType = {
    resultsPageSize: number;
};

export const useDuplicates = (dataEntryId: string, selectedScopeId: string) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext as React.Context<ResultsPageSizeContextType>);
    const dispatch = useDispatch();
    const { scopeType } = useScopeInfo(selectedScopeId);
    const orgUnitId = useCurrentOrgUnitId();
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
