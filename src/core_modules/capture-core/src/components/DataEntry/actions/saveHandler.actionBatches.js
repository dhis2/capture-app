// @flow
import { batchActions } from 'redux-batched-actions';

export const batchActionTypes = {
    UPDATE_FIELD_AND_RUN_OTHER_SAVE_HANDLER_ACTIONS_BATCH: 'UpdateFieldAndRunOtherSaveHandlerActionsBatch',
};

export const updateFieldAndRunOtherSaveHandlerActionsBatch =
    (innerAction: ReduxAction<any, any>, extraActions: { searchActions?: ?Array<ReduxAction<any, any>> } = {}) => {
        const otherActions = Object
            .keys(extraActions)
            .reduce((accOtherActions, key) => {
                const actions = extraActions[key] || [];
                return [...accOtherActions, ...actions];
            }, []);
        return batchActions(
            [innerAction, ...otherActions],
            batchActionTypes.UPDATE_FIELD_AND_RUN_OTHER_SAVE_HANDLER_ACTIONS_BATCH,
        );
    };

