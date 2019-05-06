// @flow
import { actionCreator } from '../../actions/actions.utils';

export const actionTypes = {
    UPDATE_FIELD: 'UpdateField',
};

export const updateField = (value: any, uiState: Object, elementId: string, sectionId: string, formId: string) =>
    actionCreator(actionTypes.UPDATE_FIELD)({ value, uiState, formId, sectionId, elementId });
