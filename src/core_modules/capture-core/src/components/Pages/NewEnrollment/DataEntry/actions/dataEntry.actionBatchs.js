// @flow
import { batchActions } from 'redux-batched-actions';
import { startRunRulesOnUpdateForNewEnrollment } from './dataEntry.actions';

export const batchActionTypes = {
    UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'updateFieldNewEnrollmentActionBatch',
};

export const updateFieldBatch = (innerAction: ReduxAction<any, any>) =>
    batchActions([
        innerAction,
        startRunRulesOnUpdateForNewEnrollment(innerAction.payload),
    ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
