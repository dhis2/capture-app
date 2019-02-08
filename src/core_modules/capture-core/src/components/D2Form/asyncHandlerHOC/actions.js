// @flow
import i18n from '@dhis2/d2-i18n';
import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    FIELDS_VALIDATED: 'FieldsValidated',
    FIELD_IS_VALIDATING: 'FieldIsValidating',
    CLEAN_UP_FORM_BUILDER: 'CleanUpFormBuilder',
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
