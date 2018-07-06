// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { batchActions } from 'redux-batched-actions';
import errorCreator from '../../../../../utils/errorCreator';
import getErrorMessageAndDetails from '../../../../../utils/errors/getErrorMessageAndDetails';
import {
    actionTypes,
    startRunRulesOnUpdateForEditSingleEvent,
    batchActionTypes,
} from '../editEventDataEntry.actions';
import {
    updateFormField,
    asyncUpdateFieldFailed,
    batchActionTypes as dataEntryBatchActionTypes,
} from '../../../../DataEntry/actions/dataEntry.actions';

import AsyncFieldsHandler from '../../../../DataEntry/asyncFields/AsyncFieldHandler';
import { updateFieldUIOnly } from '../../../../D2Form/formBuilder.actions';

export const editEventAsyncUpdateFieldEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(actionTypes.START_ASYNC_UPDATE_FIELD_FOR_EDIT_EVENT)
        .concatMap((action) => {
            const payload = action.payload;
            const uiState = {
                loading: false,
                valid: true,
                touched: true,
                errorMessage: null,
            };
            return AsyncFieldsHandler.executeAsyncCallback(payload.dataEntryId, payload.itemId, payload.callback)
                .then((value: any) => {
                    const innerAction = updateFormField(
                        value,
                        uiState,
                        payload.fieldId,
                        payload.formBuilderId,
                        payload.formId,
                        payload.dataEntryId,
                        payload.itemId);

                    return batchActions([
                        innerAction,
                        startRunRulesOnUpdateForEditSingleEvent(innerAction.payload),
                    ], batchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH);
                }).catch((error) => {
                    const { message, details } = getErrorMessageAndDetails(error);
                    log.error(errorCreator(
                        message ||
                        i18n.t('Field could not be updated'))(details));
                    return batchActions([
                        updateFieldUIOnly(uiState, payload.fieldId, payload.formBuilderId),
                        asyncUpdateFieldFailed(i18n.t('Field could not be updated')),
                    ], dataEntryBatchActionTypes.ASYNC_UPDATE_FIELD_FAILED_BATCH);
                });
        });
