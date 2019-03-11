// @flow
import { batchActions } from 'redux-batched-actions';

export const batchActionTypes = {
    NEW_TEI_FIELD_UPDATE_BATCH: 'NewTeiFieldUpdateBatch',
};

export const updateFieldBatch = (
    innerAction: ReduxAction<any, any>,
    extraActions: {
        filterActions: Array<ReduxAction<any, any>>,
        filterActionsToBeExecuted: Array<ReduxAction<any, any>>
    },
) => {
    const { filterActions, filterActionsToBeExecuted } = extraActions;
    return batchActions([
        innerAction,
        ...filterActionsToBeExecuted,
        ...filterActions,
    ], batchActionTypes.NEW_TEI_FIELD_UPDATE_BATCH);
};

export const asyncUpdateSuccessBatch = (
    innerAction: ReduxAction<any, any>,
    extraActions: {
        filterActions: Array<ReduxAction<any, any>>,
        filterActionsToBeExecuted: Array<ReduxAction<any, any>>,
    },
) => {
    const { filterActions, filterActionsToBeExecuted } = extraActions;
    return batchActions([
        innerAction,
        ...filterActionsToBeExecuted,
        ...filterActions,
    ], batchActionTypes.NEW_TEI_FIELD_UPDATE_BATCH);
};
