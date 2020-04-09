// @flow
import { actionTypes as dataEntryActionTypes } from '../../components/DataEntry/actions/dataEntry.actions';
import { getRulesActionsOnUpdate } from '../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';
import type { FieldData } from '../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';
type Next = (action: ReduxAction<any, any>) => void;

export default (store: ReduxStore) => (next: Next) => (action: ReduxAction<any, any>) => {
    if (action.type === dataEntryActionTypes.UPDATE_FORM_FIELD) {
        const fieldData: FieldData = {
            elementId: action.payload.elementId,
            value: action.payload.value,
            valid: action.payload.uiState.valid,
        };
        const actions = getRulesActionsOnUpdate(action.payload.formId, store.value, action.payload.formId, action.payload.dataEntryId, fieldData);
        next(action);
    } else {
        next(action);
    }
};
