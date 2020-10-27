// @flow
import { actionCreator } from '../../../../../../../actions/actions.utils';

export const actionTypes = {
    DUPLICATES_REVIEW: 'RelationshipTeiRegistrationDuplicatesReview',
    DUPLICATES_REVIEW_RETRIEVAL_SUCCESS: 'RelationshipTeiRegistrationDuplicatesReviewRetrievalSuccess',
    DUPLICATES_REVIEW_RETRIEVAL_FAILED: 'RelationshipTeiRegistrationDuplicatesReviewRetrievalFailed',
    DUPLICATES_REVIEW_CHANGE_PAGE: 'RelationshipTeiRegistrationDuplicatesChangePage',
};

export const reviewDuplicates = (pageSize: number) =>
    actionCreator(actionTypes.DUPLICATES_REVIEW)({ pageSize });

export const duplicatesForReviewRetrievalSuccess = (teis: Array<Object>, currentPage: number) =>
    actionCreator(actionTypes.DUPLICATES_REVIEW_RETRIEVAL_SUCCESS)({ teis, currentPage });

export const duplicatesForReviewRetrievalFailed = () =>
    actionCreator(actionTypes.DUPLICATES_REVIEW_RETRIEVAL_FAILED)();

export const changePage = (page: number, pageSize: number) =>
    actionCreator(actionTypes.DUPLICATES_REVIEW_CHANGE_PAGE)({ page, pageSize });
