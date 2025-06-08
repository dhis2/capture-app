import log from 'loglevel';
import { concatMap } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import type { Observable } from 'rxjs';

import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { getErrorMessageAndDetails } from '../../../utils/errors/getErrorMessageAndDetails';
import {
    actionTypes,
    updateFieldFromAsync,
    asyncUpdateFieldFailed,
} from './actions';

export const asyncUpdateFieldEpic = (action$: Observable<any>) =>
    action$.pipe(
        ofType(actionTypes.START_UPDATE_FIELD_ASYNC),
        concatMap((action) => {
            const payload = action.payload;
            const { elementId, formBuilderId, formId, callback, uid, onSuccess, onError } = payload;

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
                    return onSuccess ? onSuccess(innerAction) : innerAction;
                })
                .catch((error: any) => {
                    const { message } = getErrorMessageAndDetails(error);
                    const errorMessage = i18n.t('Async field update failed');
                    log.error(errorCreator(message || errorMessage)({ error }));
                    const innerErrorAction =
                        asyncUpdateFieldFailed(errorMessage, uiState, elementId, formBuilderId, formId, uid);
                    return onError ? onError(innerErrorAction) : innerErrorAction;
                });
        }));
