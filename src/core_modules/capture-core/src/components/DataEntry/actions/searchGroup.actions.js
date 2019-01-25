// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    SEARCH_GROUP_RESULT_COUNT_RETRIVED: 'SearchGroupResultCountRetrieved',
};

export const searchGroupResultCountRetrieved = (count: number, dataEntryKey: string, groupId: string) =>
    actionCreator(actionTypes.SEARCH_GROUP_RESULT_COUNT_RETRIVED)({ count, dataEntryKey, groupId });
