import type { OrgUnit } from '@dhis2/rules-engine-javascript';
import { batchActions } from 'redux-batched-actions';
import { actionCreator, actionPayloadAppender } from '../../../actions/actions.utils';
import type { ProgramCategory } from '../../WidgetEventSchedule/CategoryOptions/CategoryOptions.types';

export const batchActionTypes = {
    UPDATE_DATA_ENTRY_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH: 'UpdateDataEntryFieldForEditSingleEventActionsBatch',
    UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH: 'UpdateFieldForEditSingleEventActionsBatch',
    RULES_EFFECTS_ACTIONS_BATCH: 'RulesEffectsForEditSingleEventActionsBatch',
};

export const actionTypes = {
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForEditSingleEvent',
    RULES_EXECUTED_POST_UPDATE_FIELD: 'RulesExecutedPostUpdateFieldForEditSingleEvent',
};

function getLoadActions(
    dataEntryId: string,
    itemId: string,
    dataEntryValues: Record<string, unknown>,
    formValues: Record<string, unknown>,
    dataEntryPropsToInclude: Array<Record<string, unknown>>,
    clientValuesForDataEntry: Record<string, unknown>,
    extraProps: { [key: string]: any },
) {
    const dataEntryNotes: any[] = [];

    return batchActions([
        { type: 'START_SHOW_EDIT_EVENT_IN_DATA_ENTRY', payload: { dataEntryId, dataEntryValues, dataEntryPropsToInclude, extraProps } },
        ...dataEntryNotes.map(note => ({ type: 'ADD_NOTE', payload: { dataEntryId, itemId, note } })),
    ], batchActionTypes.UPDATE_DATA_ENTRY_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH);
}

export const loadEditEventDataEntry = (
    dataEntryId: string,
    itemId: string,
    dataEntryValues: Record<string, unknown>,
    formValues: Record<string, unknown>,
    dataEntryPropsToInclude: Array<Record<string, unknown>>,
    clientValuesForDataEntry: Record<string, unknown>,
    extraProps: { [key: string]: any },
) => getLoadActions(
    dataEntryId,
    itemId,
    dataEntryValues,
    formValues,
    dataEntryPropsToInclude,
    clientValuesForDataEntry,
    extraProps,
);

export const updateDataEntryFieldEditSingleEvent = (
    elementId: string,
    value: any,
    uiState: Record<string, unknown>,
    dataEntryId: string,
    itemId: string,
    formBuilderId: string,
    formId: string,
    programId: string,
    orgUnit: OrgUnit,
    categories: Array<ProgramCategory>,
) => {
    const updateFieldAction = actionCreator('UPDATE_DATA_ENTRY_FIELD')({
        elementId,
        value,
        uiState,
        dataEntryId,
        itemId,
    });

    const updateFormFieldAction = actionCreator('UPDATE_FORM_FIELD')({
        elementId,
        value,
        formBuilderId,
        formId,
    });

    const startRunRulesAction = actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)({
        dataEntryId,
        itemId,
        uid: elementId,
        programId,
        orgUnit,
        categories,
    });

    return batchActions([
        updateFieldAction,
        updateFormFieldAction,
        startRunRulesAction,
    ], batchActionTypes.UPDATE_DATA_ENTRY_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH);
};

export const updateFieldEditSingleEvent = (
    elementId: string,
    value: any,
    uiState: Record<string, unknown>,
    dataEntryId: string,
    itemId: string,
    formBuilderId: string,
    formId: string,
    programId: string,
    orgUnit: OrgUnit,
    categories: Array<ProgramCategory>,
) => {
    const updateFieldAction = actionCreator('UPDATE_FIELD')({
        elementId,
        value,
        uiState,
        dataEntryId,
        itemId,
    });

    const updateFormFieldAction = actionCreator('UPDATE_FORM_FIELD')({
        elementId,
        value,
        formBuilderId,
        formId,
    });

    const startRunRulesAction = actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)({
        elementId,
        value,
        uiState,
        dataEntryId,
        itemId,
        uid: elementId,
        programId,
        orgUnit,
        categories,
    });

    return batchActions([
        updateFieldAction,
        updateFormFieldAction,
        startRunRulesAction,
    ], batchActionTypes.UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH);
};

export const startAsyncUpdateFieldForEditEvent = (
    innerAction: any,
    onSuccess: () => void,
    onError: () => void,
) =>
    actionCreator('START_ASYNC_UPDATE_FIELD_FOR_EDIT_EVENT')({
        innerAction,
        onSuccess,
        onError,
    });

export const batchActionCreator = actionPayloadAppender;
