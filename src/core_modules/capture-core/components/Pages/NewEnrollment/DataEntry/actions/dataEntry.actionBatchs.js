// @flow
import uuid from 'uuid/v4';
import { batchActions } from 'redux-batched-actions';
import { startRunRulesPostUpdateField } from '../../../../DataEntry';

export const batchActionTypes = {
  UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'UpdateFieldNewEnrollmentActionBatch',
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
  const { filterActionsToBeExecuted } = extraActions;
  const uid = uuid();

  return batchActions(
    [
      innerAction,
      ...filterActionsToBeExecuted,
      startRunRulesPostUpdateField(dataEntryId, itemId, uid),
    ],
    batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH,
  );
};
