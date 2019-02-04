// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    SEARCH_GROUP_RESULT_COUNT_RETRIVED: 'SearchGroupResultCountRetrieved',
    SEARCH_GROUP_RESULT_COUNT_RETRIEVAL_FAILED: 'SearchGroupResultCountRetrievalFailed',
    START_SEARCH_GROUP_COUNT_SEARCH: 'StartSearchGroupCountSearch',
};

export const searchGroupResultCountRetrieved = (count: number, dataEntryKey: string, groupId: string) =>
    actionCreator(actionTypes.SEARCH_GROUP_RESULT_COUNT_RETRIVED)({ count, dataEntryKey, groupId });

export const searchGroupResultCountRetrievalFailed = (error: string, dataEntryKey: string, groupId: string) =>
    actionCreator(actionTypes.SEARCH_GROUP_RESULT_COUNT_RETRIEVAL_FAILED)({ error, dataEntryKey, groupId });

export const startSearchGroupCountSearch =
    (searchGroup: Object, promiseContainer: Object, dataEntryKey: string, contextProps: Object) =>
        actionCreator(actionTypes.START_SEARCH_GROUP_COUNT_SEARCH)(
            { searchGroup, promiseContainer, dataEntryKey, contextProps });
