// @flow
import { batchActions } from 'redux-batched-actions';
import {
    actionTypes,
    startRunRulesOnUpdateForNewSingleEvent,
    batchActionTypes,
} from '../newEventDataEntry.actions';
import { updateFormField } from '../../../../DataEntry/actions/dataEntry.actions';

import AsyncFieldsHandler from '../../../../DataEntry/asyncFields/AsyncFieldHandler';

export const asyncUpdateFieldEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(actionTypes.START_ASYNC_UPDATE_FIELD)
        .concatMap((action) => {
            const payload = action.payload;
            return AsyncFieldsHandler.executeAsyncCallback(payload.dataEntryId, payload.itemId, payload.callback, () => {})
                .then((value: any) => {
                    const uiState = {
                        valid: true,
                        touched: true,
                        errorMessage: null,
                    };

                    const innerAction = updateFormField(value, uiState, payload.fieldId, payload.formBuilderId, payload.formId, payload.dataEntryId, payload.itemId);
                    return batchActions([
                        innerAction,
                        startRunRulesOnUpdateForNewSingleEvent(innerAction.payload),
                    ], batchActionTypes.UPDATE_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH);
                });
        });
