// @flow
import { batchActions } from 'redux-batched-actions';
import { startRunRulesOnUpdateForNewEnrollment } from './dataEntry.actions';


export const batchActionTypes = {
    UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH: 'UpdateFieldNewEnrollmentActionBatch',
};

export const updateFieldBatch =
    (innerAction: ReduxAction<any, any>, extraActions: { searchActions: ?Array<ReduxAction<any, any>>}) => {
        const searchActions = extraActions && extraActions.searchActions;

        return batchActions([
            innerAction,
            startRunRulesOnUpdateForNewEnrollment(innerAction.payload, searchActions),
        ], batchActionTypes.UPDATE_FIELD_NEW_ENROLLMENT_ACTION_BATCH);
    };
