import { batchActions } from 'redux-batched-actions';
import type { ReduxAction } from 'capture-core-utils/types';

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
