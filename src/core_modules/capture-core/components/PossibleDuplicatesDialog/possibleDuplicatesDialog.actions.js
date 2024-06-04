// @flow
import { actionCreator } from '../../actions/actions.utils';
import type { ChangePageActionCreator, ReviewDuplicatesActionCreator } from './PossibleDuplicatesDialog.types';

export const actionTypes = {
    DUPLICATES_REVIEW: 'PossibleDuplicatesReview',
    DUPLICATES_REVIEW_RETRIEVAL_SUCCESS: 'PossibleDuplicatesReviewRetrievalSuccess',
    DUPLICATES_REVIEW_RETRIEVAL_FAILED: 'PossibleDuplicatesReviewRetrievalFailed',
    DUPLICATES_REVIEW_SKIPPED: 'PossibleDuplicatesReview.Skipped',
    DUPLICATES_REVIEW_CHANGE_PAGE: 'PossibleDuplicatesChangePage',
    DUPLICATES_RESET: 'PossibleDuplicatesReset',
};


export const reviewDuplicates = ({
    pageSize,
    orgUnitId,
    selectedScopeId,
    scopeType,
    dataEntryId,
}: ReviewDuplicatesActionCreator) =>
    actionCreator(actionTypes.DUPLICATES_REVIEW)({
        pageSize,
        page: 1,
        orgUnitId,
        selectedScopeId,
        scopeType,
        dataEntryId,
    });

export const duplicatesForReviewRetrievalSuccess = (teis: Array<Object>, currentPage: number) =>
    actionCreator(actionTypes.DUPLICATES_REVIEW_RETRIEVAL_SUCCESS)({ teis, currentPage });

export const duplicatesReviewSkipped = () =>
    actionCreator(actionTypes.DUPLICATES_REVIEW_SKIPPED)();

export const duplicatesForReviewRetrievalFailed = () =>
    actionCreator(actionTypes.DUPLICATES_REVIEW_RETRIEVAL_FAILED)();

export const changePage = ({
    pageSize,
    page,
    orgUnitId,
    selectedScopeId,
    scopeType,
    dataEntryId,
}: ChangePageActionCreator) =>
    actionCreator(actionTypes.DUPLICATES_REVIEW_CHANGE_PAGE)({
        page,
        pageSize,
        orgUnitId,
        selectedScopeId,
        scopeType,
        dataEntryId,
    });

export const duplicatesReset = () => actionCreator(actionTypes.DUPLICATES_RESET)();
