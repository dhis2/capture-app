// @flow
import { batchActions } from 'redux-batched-actions';

export const batchActionTypes = {
    UPDATE_FIELD_AND_RUN_SEARCH_GROUP_SEARCHES_BATCH: 'UpdateFieldAndRunSearchGroupSearchesBatch',
};

export const updateFieldAndRunSearchGroupSearchesBatch =
    (innerAction: ReduxAction<any, any>, searchActions: Array<ReduxAction<any, any>>) =>
        batchActions([innerAction, ...searchActions], batchActionTypes.UPDATE_FIELD_AND_RUN_SEARCH_GROUP_SEARCHES_BATCH);
