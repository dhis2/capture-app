import { actionCreator } from '../../../actions/actions.utils';

export const actionTypes = {
    UPDATE_FIELD_UI_ONLY: 'UpdateFieldUIOnly',
};

export const updateFieldUIOnly = (uiState: Record<string, unknown>, elementId: string, sectionId: string) =>
    actionCreator(actionTypes.UPDATE_FIELD_UI_ONLY)({ uiState, elementId, sectionId });
