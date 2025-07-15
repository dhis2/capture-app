import { actionCreator, actionPayloadAppender } from '../../../../actions/actions.utils';
import type { AddEventSaveType } from '../addEventSaveTypes';

export const newEventWidgetDataEntryBatchActionTypes = {
    UPDATE_DATA_ENTRY_FIELD_ADD_EVENT_ACTION_BATCH: 'UpdateDataEntryFieldForAddEventActionsBatch',
    FIELD_UPDATE_BATCH: 'NewEvent.UpdateFieldBatch',
    OPEN_ADD_EVENT_IN_DATA_ENTRY_ACTIONS_BATCH: 'OpenAddEventInDataEntryActionsBatch',
    RULES_EFFECTS_ACTIONS_BATCH: 'RulesEffectsForAddEventActionsBatch',
};

export const newEventWidgetDataEntryActionTypes = {
    RULES_ON_UPDATE_EXECUTE: 'NewEvent.ExecuteRulesOnUpdate',
    EVENT_NOTE_ADD: 'NewEvent.AddEventNote',
    SET_ADD_EVENT_SAVE_TYPES: 'SetNewEventSaveTypes',
};

export const executeRulesOnUpdateForNewEvent = (actionData: { payload: any }) =>
    actionCreator(newEventWidgetDataEntryActionTypes.RULES_ON_UPDATE_EXECUTE)(actionData);

export const setNewEventSaveTypes = (newSaveTypes: AddEventSaveType[] | null) =>
    actionCreator(newEventWidgetDataEntryActionTypes.SET_ADD_EVENT_SAVE_TYPES)({ saveTypes: newSaveTypes });

export const addNewEventNote = (itemId: string, dataEntryId: string, note: string) =>
    actionCreator(newEventWidgetDataEntryActionTypes.EVENT_NOTE_ADD)({ itemId, dataEntryId, note });

export const startAsyncUpdateFieldForNewEvent = (
    innerAction: any,
    onSuccess: (action: any) => any,
    onError: (action: any) => any,
) =>
    actionPayloadAppender(innerAction)({ onSuccess, onError });
