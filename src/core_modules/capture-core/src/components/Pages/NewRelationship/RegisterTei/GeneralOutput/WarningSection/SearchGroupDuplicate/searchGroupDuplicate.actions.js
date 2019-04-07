// @flow
import { actionCreator } from '../../../../../../../actions/actions.utils';

export const actionTypes = {
    DUPLICATES_REVIEW: 'RelationshipTeiRegistrationDuplicatesReview',
    DUPLICATES_REVIEW_RETRIEVAL_SUCCESS: 'RelationshipTeiRegistrationDuplicatesReviewRetrievalSuccess',
    DUPLICATES_REVIEW_RETRIEVAL_FAILED: 'RelationshipTeiRegistrationDuplicatesReviewRetrievalFailed',
};

export const reviewDuplicates = () => actionCreator(actionTypes.DUPLICATES_REVIEW)();
export const duplicatesForReviewRetrievalSuccess =
    (teis: Array<Object>) =>
        actionCreator(actionTypes.DUPLICATES_REVIEW_RETRIEVAL_SUCCESS)({ teis });
export const duplicatesForReviewRetrievalFailed = () => actionCreator(actionTypes.DUPLICATES_REVIEW_RETRIEVAL_FAILED)();
