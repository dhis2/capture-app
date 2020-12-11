// @flow
import { actionCreator, actionPayloadAppender } from '../../../actions/actions.utils';

export const actionTypes = {
  SEARCH_GROUP_RESULT_COUNT_RETRIVED: 'SearchGroupResultCountRetrieved',
  SEARCH_GROUP_RESULT_COUNT_RETRIEVAL_FAILED: 'SearchGroupResultCountRetrievalFailed',
  FILTER_SEARCH_GROUP_FOR_COUNT_SEARCH: 'FilterSearchGroupForCountSearch',
  FILTER_SEARCH_GROUP_FOR_COUNT_TO_BE_EXECUTED: 'FilterSearchGroupForCountSearchToBeExecuted',
  START_SEARCH_GROUP_COUNT_SEARCH: 'StartSearchGroupCountSearch',
  ABORT_SEARCH_GROUP_COUNT_SEARCH: 'AbortSearchGroupCountSearch',
  CANCEL_SEARCH_GROUP_COUNT_SEARCH: 'CancelSearchGroupCountSearch',
};

export const searchGroupResultCountRetrieved = (
  count: number,
  dataEntryKey: string,
  groupId: string,
  uids: string,
) =>
  actionCreator(actionTypes.SEARCH_GROUP_RESULT_COUNT_RETRIVED)({
    count,
    dataEntryKey,
    groupId,
    uids,
  });

export const searchGroupResultCountRetrievalFailed = (
  error: string,
  dataEntryKey: string,
  groupId: string,
  uids: string,
) =>
  actionCreator(actionTypes.SEARCH_GROUP_RESULT_COUNT_RETRIEVAL_FAILED)({
    error,
    dataEntryKey,
    groupId,
    uids,
  });

export const filterSearchGroupForCountSearch = (
  searchGroup: Object,
  uid: string,
  dataEntryKey: string,
  contextProps: Object,
) =>
  actionCreator(actionTypes.FILTER_SEARCH_GROUP_FOR_COUNT_SEARCH)({
    searchGroup,
    uid,
    dataEntryKey,
    contextProps,
  });

export const filterSearchGroupForCountSearchToBeExecuted = (
  filterSearchGroupForCountSearchAction: Object,
) =>
  actionCreator(actionTypes.FILTER_SEARCH_GROUP_FOR_COUNT_TO_BE_EXECUTED)({
    ...filterSearchGroupForCountSearchAction.payload,
  });

export const startSearchGroupCountSearch = (
  searchGroup: Object,
  searchGroupId: string,
  uid: string,
  dataEntryKey: string,
  contextProps: Object,
  values: Object,
) =>
  actionCreator(actionTypes.START_SEARCH_GROUP_COUNT_SEARCH)({
    searchGroup,
    searchGroupId,
    uid,
    dataEntryKey,
    contextProps,
    values,
  });

export const abortSearchGroupCountSearch = (
  dataEntryKey: string,
  searchGroup: Object,
  groupId: string,
  uids: Array<string>,
) =>
  actionCreator(actionTypes.ABORT_SEARCH_GROUP_COUNT_SEARCH)({
    dataEntryKey,
    searchGroup,
    groupId,
    uids,
  });

export const cancelSearchGroupCountSearch = (dataEntryKey: string, uid: string) =>
  actionCreator(actionTypes.CANCEL_SEARCH_GROUP_COUNT_SEARCH)({ dataEntryKey, uid });

export const startAsyncUpdateField = (
  innerAction: ReduxAction<any, any>,
  onSuccess: Function,
  onError: Function,
) => actionPayloadAppender(innerAction)({ onSuccess, onError });
