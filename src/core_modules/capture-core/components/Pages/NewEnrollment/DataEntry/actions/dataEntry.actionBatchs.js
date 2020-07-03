// @flow
import uuid from 'uuid/v4';
import { batchActions } from 'redux-batched-actions';
import { startRunRulesPostUpdateField } from '../../../../DataEntry';
// $FlowFixMe[missing-export] automated comment
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
    const { dataEntryId, itemId } = innerAction.payload;
    const uid = uuid();

    return batchActions([
        innerAction,
        ...filterActionsToBeExecuted,
        startRunRulesPostUpdateField(dataEntryId, itemId, uid),
        // todo this is undefined (lgtm)
        startRunRulesOnUpdateForNewEnrollment(innerAction.payload, filterActions, uid),
    ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};

export const asyncUpdateSuccessBatch = (
    innerAction: ReduxAction<any, any>,
    extraActions: {
        filterActions: Array<ReduxAction<any, any>>,
        filterActionsToBeExecuted: Array<ReduxAction<any, any>>,
    },
    dataEntryId: string,
    itemId: string,
) => {
    const { filterActions, filterActionsToBeExecuted } = extraActions;
    const uid = uuid();

    return batchActions([
        innerAction,
        ...filterActionsToBeExecuted,
        startRunRulesPostUpdateField(dataEntryId, itemId, uid),
        // todo this is undefined (lgtm)
        startRunRulesOnUpdateForNewEnrollment({ ...innerAction.payload, dataEntryId, itemId }, filterActions, uid),
    ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
};
