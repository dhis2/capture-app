// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { batchActions } from 'redux-batched-actions';
import errorCreator from '../../../../../utils/errorCreator';
import getErrorMessageAndDetails from '../../../../../utils/errors/getErrorMessageAndDetails';
import {
    actionTypes,
    startRunRulesOnUpdateForNewSingleEvent,
    batchActionTypes,
} from '../newEventDataEntry.actions';
import {
    updateFormField,
    asyncUpdateFieldFailed,
    batchActionTypes as dataEntryBatchActionTypes,
} from '../../../../DataEntry/actions/dataEntry.actions';

import AsyncFieldsHandler from '../../../../DataEntry/asyncFields/AsyncFieldHandler';
import { updateFieldUIOnly } from '../../../../D2Form/formBuilder.actions';

export const newEventAsyncUpdateFieldEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(actionTypes.START_ASYNC_UPDATE_FIELD_FOR_NEW_EVENT)
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
                        startRunRulesOnUpdateForNewSingleEvent(innerAction.payload),
                    ], batchActionTypes.UPDATE_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH);
                })
                .catch((error) => {
                    const { message } = getErrorMessageAndDetails(error);
                    const errorMessage = `${i18n.t('Field')} ${payload.fieldLabel} ${i18n.t('could not be updated')}`;
                    log.error(errorCreator(
                        message ||
                        errorMessage));

                    return batchActions([
                        updateFieldUIOnly(uiState, payload.fieldId, payload.formBuilderId),
                        asyncUpdateFieldFailed(errorMessage),
                    ], dataEntryBatchActionTypes.ASYNC_UPDATE_FIELD_FAILED_BATCH);
                });
        });
