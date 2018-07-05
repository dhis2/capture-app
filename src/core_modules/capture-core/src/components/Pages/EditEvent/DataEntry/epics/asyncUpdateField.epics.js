// @flow
import { batchActions } from 'redux-batched-actions';
import {
    actionTypes,
    startRunRulesOnUpdateForEditSingleEvent,
    batchActionTypes,
} from '../EditEventDataEntry.actions';
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
                        loading: false,
                        valid: true,
                        touched: true,
                        errorMessage: null,
                    };

                    const innerAction = updateFormField(value, uiState, payload.fieldId, payload.formBuilderId, payload.formId, payload.dataEntryId, payload.itemId);
                    return batchActions([
                        innerAction,
                        startRunRulesOnUpdateForEditSingleEvent(innerAction.payload),
                    ], batchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH);
                });
        });
