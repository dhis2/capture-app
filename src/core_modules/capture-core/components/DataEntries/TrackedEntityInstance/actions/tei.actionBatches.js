// @flow
import { batchActions } from 'redux-batched-actions';

export const batchActionTypes = {
    NEW_TEI_FIELD_UPDATE_BATCH: 'NewTeiFieldUpdateBatch',
};

export const updateFieldBatch = (
    innerAction: ReduxAction<any, any>,
) => batchActions([
    innerAction,
], batchActionTypes.NEW_TEI_FIELD_UPDATE_BATCH);

export const asyncUpdateSuccessBatch = (
    innerAction: ReduxAction<any, any>,
) => batchActions([
    innerAction,
], batchActionTypes.NEW_TEI_FIELD_UPDATE_BATCH);
