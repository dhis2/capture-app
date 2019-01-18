// @flow
import { actionCreator } from '../../actions/actions.utils';

export const actionTypes = {
    FIELDS_VALIDATED: 'FieldsValidated',
    UPDATE_FIELD_UI_ONLY: 'UpdateFieldUIOnly',
    FIELD_IS_VALIDATING: 'FieldIsValidating',
};

export const fieldsValidated = (fieldsUI: Object, id: string) =>
    actionCreator(actionTypes.FIELDS_VALIDATED)({ fieldsUI, id });
export const updateFieldUIOnly = (uiState: Object, elementId: string, sectionId: string) =>
    actionCreator(actionTypes.UPDATE_FIELD_UI_ONLY)({ uiState, elementId, sectionId });
export const fieldIsValidating = (fieldId: string, formBuilderId: string) =>
    actionCreator(actionTypes.FIELD_IS_VALIDATING)({ fieldId, formBuilderId });
