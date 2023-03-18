// @flow
import { actionCreator, actionPayloadAppender } from '../../../../actions/actions.utils';
import typeof { addEventSaveTypes } from '../addEventSaveTypes';

export const newEventWidgetDataEntryBatchActionTypes = {
    UPDATE_DATA_ENTRY_FIELD_ADD_EVENT_ACTION_BATCH: 'UpdateDataEntryFieldForAddEventActionsBatch',
    FIELD_UPDATE_BATCH: 'NewEvent.UpdateFieldBatch',
    OPEN_ADD_EVENT_IN_DATA_ENTRY_ACTIONS_BATCH: 'OpenAddEventInDataEntryActionsBatch',
    RULES_EFFECTS_ACTIONS_BATCH: 'RulesEffectsForAddEventActionsBatch',
};

export const newEventWidgetDataEntryActionTypes = {
    RULES_ON_UPDATE_EXECUTE: 'NewEvent.ExecuteRulesOnUpdate',
    EVENT_NOTE_ADD: 'NewEvent.AddEventNote',
    SET_ADD_EVENT_SAVE_TYPES: 'SetNewEventSaveTypes',  // TODO: https://jira.dhis2.org/browse/DHIS2-11669
};

export const executeRulesOnUpdateForNewEvent = (actionData: { payload: Object}) =>
    actionCreator(newEventWidgetDataEntryActionTypes.RULES_ON_UPDATE_EXECUTE)(actionData);

export const setNewEventSaveTypes = (newSaveTypes: ?Array<$Values<addEventSaveTypes>>) =>
    actionCreator(newEventWidgetDataEntryActionTypes.SET_ADD_EVENT_SAVE_TYPES)({ saveTypes: newSaveTypes });

export const addNewEventNote = (itemId: string, dataEntryId: string, note: string) =>
    actionCreator(newEventWidgetDataEntryActionTypes.EVENT_NOTE_ADD)({ itemId, dataEntryId, note });

export const startAsyncUpdateFieldForNewEvent = (
    innerAction: ReduxAction<any, any>,
    onSuccess: Function,
    onError: Function,
) =>
    actionPayloadAppender(innerAction)({ onSuccess, onError });
