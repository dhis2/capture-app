// @flow
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { batchActions } from 'redux-batched-actions';
import errorCreator from '../../../utils/errorCreator';
import getErrorMessageAndDetails from '../../../utils/errors/getErrorMessageAndDetails';
import {
    actionTypes,
    updateFieldFromAsync,
    asyncUpdateFieldFailed,
} from './actions';

export const asyncUpdateFieldEpic = (action$: InputObservable) =>
    // $FlowSuppress
    action$.ofType(actionTypes.START_UPDATE_FIELD_ASYNC)
        .concatMap((action) => {
            const payload = action.payload;
            const { elementId, formBuilderId, formId, callback, uid, completedData } = payload;
            const {
                successActionCreators = [],
                successBatchName,
                errorActionCreators = [],
                errorBatchName,
            } = completedData;

            const uiState = {
                valid: true,
                touched: true,
                errorMessage: null,
            };

            return callback()
                .then((value: any) => {
                    const innerAction = updateFieldFromAsync(
                        value,
                        uiState,
                        elementId,
                        formBuilderId,
                        formId,
                        uid,
                    );

                    const successActions = successActionCreators
                        .map(creator => creator(innerAction.payload));

                    return batchActions([
                        innerAction,
                        ...successActions,
                    ], successBatchName);
                })
                .catch((error) => {
                    const { message } = getErrorMessageAndDetails(error);
                    const errorMessage = i18n.t('Async field update failed');
                    log.error(errorCreator(message || errorMessage)({ error }));

                    const errorActions = errorActionCreators
                        .map(creator => creator());

                    return batchActions([
                        asyncUpdateFieldFailed(errorMessage, uiState, elementId, formBuilderId, uid),
                        ...errorActions,
                    ], errorBatchName);
                });
        });
