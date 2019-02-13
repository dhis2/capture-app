// @flow
import i18n from '@dhis2/d2-i18n';
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    FIELDS_VALIDATED: 'FieldsValidated',
    FIELD_IS_VALIDATING: 'FieldIsValidating',
    CLEAN_UP_FORM_BUILDER: 'CleanUpFormBuilder',
    START_UPDATE_FIELD_ASYNC: 'StartUpdateFieldAsync',
    UPDATE_FIELD_FROM_ASYNC: 'UpdateFieldFromAsync',
    ASYNC_UPDATE_FIELD_FAILED: 'AsyncUpdateFieldFailed',
};

export const fieldIsValidating = (
    fieldId: string,
    formBuilderId: string,
    formId: string,
    message: ?string,
    fieldUIUpdates: ?Object,
    validatingUid: string,
) =>
    actionCreator(actionTypes.FIELD_IS_VALIDATING)(
        {
            fieldId,
            formBuilderId,
            formId,
            message: message || i18n.t('This value is validating'),
            fieldUIUpdates,
            validatingUid,
        },
    );

export const fieldsValidated = (
    fieldsUI: Object,
    formBuilderId: string,
    formId: string,
    validatingUids: Array<string>,
) =>
    actionCreator(actionTypes.FIELDS_VALIDATED)(
        { fieldsUI, formBuilderId, formId, validatingUids });

export const cleanUpFormBuilder = (remainingUids: Array<string>, formId: string) =>
    actionCreator(actionTypes.CLEAN_UP_FORM_BUILDER)(
        { remainingUids, formId });

export const startUpdateFieldAsync = (
    elementId: string,
    fieldLabel: string,
    formBuilderId: string,
    formId: string,
    uid: string,
    callback: Function,
) => actionCreator(actionTypes.START_UPDATE_FIELD_ASYNC)(
    { elementId, fieldLabel, formBuilderId, formId, uid, callback });

export const updateFieldFromAsync = (
    value: any,
    uiState: Object,
    elementId: string,
    formBuilderId: string,
    formId: string,
    uid: string,
) => actionCreator(actionTypes.UPDATE_FIELD_FROM_ASYNC)(
    { value, uiState, elementId, formBuilderId, formId, uid });

export const asyncUpdateFieldFailed = (
    message: string,
    uiState: Object,
    elementId: string,
    formBuilderId: string,
    uid: string,
) =>
    actionCreator(actionTypes.ASYNC_UPDATE_FIELD_FAILED)({ message, uiState, elementId, formBuilderId, uid });
