// @flow
import { batchActions } from 'redux-batched-actions';
import { startRunRulesOnUpdateForNewEnrollment } from './dataEntry.actions';


export const batchActionTypes = {
    UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'UpdateFieldNewEnrollmentActionBatch',
};

export const updateFieldBatch = (
    innerAction: ReduxAction<any, any>,
    extraActions: {
        filterActions: Array<ReduxAction<any, any>>,
        filterActionsToBeExecuted: Array<ReduxAction<any, any>>
    }) => {
    const { filterActions, filterActionsToBeExecuted } = extraActions;

    return batchActions([
        innerAction,
        ...filterActionsToBeExecuted,
        startRunRulesOnUpdateForNewEnrollment(innerAction.payload, filterActions),
    ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};
