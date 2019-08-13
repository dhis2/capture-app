// @flow
import { actionCreator } from '../../../actions/actions.utils';

export const batchActionTypes = {
    ASYNC_UPDATE_FIELD_FAILED_BATCH: 'AsyncUpdateFieldFailedBatch',
};

export const actionTypes = {
    START_COMPLETE_EVENT: 'StartCompleteDataEntryEvent',
    COMPLETE_EVENT: 'CompleteDataEntryEvent',
    COMPLETE_EVENT_ERROR: 'CompleteDataEntryEventError',
    COMPLETE_VALIDATION_FAILED: 'CompleteValidationFailedForDataEntry',
    COMPLETE_ABORT: 'CompleteAbortedForDataEntry',
    START_SAVE_EVENT: 'StartSaveDataEntryEvent',
    SAVE_EVENT: 'SaveDataEntryEvent',
    SAVE_EVENT_ERROR: 'SaveDataEntryEventError',
    SAVE_VALIDATION_FALED: 'SaveValidationFailedForDataEntry',
    SAVE_ABORT: 'SaveAbortedForDataEntry',
    UPDATE_FIELD: 'UpdateDataEntryField',
    UPDATE_FORM_FIELD: 'UpdateDataEntryFormField',
    RULES_EXECUTED_POST_UPDATE_FIELD: 'RulesExecutedPostUpdateFieldDataEntry',
    ADD_DATA_ENTRY_NOTE: 'AddDataEntryNote',
    REMOVE_DATA_ENTRY_NOTE: 'RemoveDataEntryNote',
    SET_CURRENT_DATA_ENTRY: 'SetCurrentDataEntry',
    START_RUN_RULES_POST_UPDATE_FIELD: 'StartRunRulesPostUpdateFieldDataEntry',
    REMOVE_DATA_ENTRY_RELATIONSHIP: 'RemoveDataEntryRelationship',
    ADD_DATA_ENTRY_RELATIONSHIP: 'AddDataEntryRelationship',
    DATA_ENTRY_RELATIONSHIP_ALREADY_EXISTS: 'DataEntryRelationshipAlreadyExists',
};

// COMPLETE
export const startCompleteEvent =
    (eventId: string, id: string) => actionCreator(actionTypes.START_COMPLETE_EVENT)({ eventId, id });

export const completeEventError =
    (error: string, id: string) => actionCreator(actionTypes.COMPLETE_EVENT_ERROR)({ error, id });

export const completeEvent =
    (clientValues: ?Object, serverData: Object, event: Object, eventId: string, id: string) =>
        actionCreator(actionTypes.COMPLETE_EVENT)({
            clientValues,
            eventId,
            event: { ...event, status: 'COMPLETED' },
            requestInfo: {
                data: serverData,
                endpoint: `events/${eventId}`,
                method: 'POST',
            },
            id,
        },
        {
            isOptimistic: true,
        });

export const completeValidationFailed =
    (eventId: string, id: string) => actionCreator(actionTypes.COMPLETE_VALIDATION_FAILED)({ eventId, id });

export const completeAbort =
    (eventId: string, id: string) => actionCreator(actionTypes.COMPLETE_ABORT)({ eventId, id });

// SAVE
export const startSaveEvent =
    (eventId: string, id: string) => actionCreator(actionTypes.START_SAVE_EVENT)({ eventId, id });

export const saveEventError = (error: string, id: string) => actionCreator(actionTypes.SAVE_EVENT_ERROR)({ error, id });

export const saveEvent =
    (clientValues: ?Object, serverData: Object, event: Object, eventId: string, id: string) =>
        actionCreator(actionTypes.SAVE_EVENT)({
            clientValues,
            eventId,
            event,
            requestInfo: {
                data: serverData,
                endpoint: `events/${eventId}`,
                method: 'POST',
            },
            id,
        },
        {
            isOptimistic: true,
        });

export const saveValidationFailed =
    (itemId: string, id: string) => actionCreator(actionTypes.SAVE_VALIDATION_FALED)({ itemId, id });

export const saveAbort =
    (itemId: string, id: string) => actionCreator(actionTypes.SAVE_ABORT)({ itemId, id });

export const updateField =
    (value: any, valueMeta: Object, fieldId: string, dataEntryId: string, itemId: string) =>
        actionCreator(actionTypes.UPDATE_FIELD)({ value, valueMeta, fieldId, dataEntryId, itemId });

export const updateFormField =
    (
        value: any,
        uiState: Object,
        elementId: string,
        formBuilderId: string,
        formId: string,
        dataEntryId: string,
        itemId: string,
        updateCompleteUid: string,
    ) =>
        actionCreator(
            actionTypes.UPDATE_FORM_FIELD)({
            value,
            uiState,
            formId,
            formBuilderId,
            elementId,
            dataEntryId,
            itemId,
            updateCompleteUid,
        });

export const startRunRulesPostUpdateField =
    (dataEntryId: string, itemId: string, uid: string) =>
        actionCreator(actionTypes.START_RUN_RULES_POST_UPDATE_FIELD)({ dataEntryId, itemId, uid });

export const rulesExecutedPostUpdateField =
    (dataEntryId: string, itemId: string, uid: string) =>
        actionCreator(actionTypes.RULES_EXECUTED_POST_UPDATE_FIELD)({ dataEntryId, itemId, uid });

export const addNote =
    (dataEntryId: string, itemId: string, note: Object) =>
        actionCreator(actionTypes.ADD_DATA_ENTRY_NOTE)({ dataEntryId, itemId, note });

export const removeNote =
    (dataEntryId: string, itemId: string, noteClientId: string) =>
        actionCreator(actionTypes.REMOVE_DATA_ENTRY_NOTE)({ dataEntryId, itemId, noteClientId });

export const setCurrentDataEntry =
    (dataEntryId: string, itemId: string, extraProps?: ?any) =>
        actionCreator(actionTypes.SET_CURRENT_DATA_ENTRY)({ dataEntryId, itemId, extraProps });

export const removeRelationship =
    (dataEntryId: string, itemId: string, relationshipClientId: string) =>
        actionCreator(actionTypes.REMOVE_DATA_ENTRY_RELATIONSHIP)({ dataEntryId, itemId, relationshipClientId });

export const addRelationship =
    (dataEntryId: string, itemId: string, relationship: Object, newToEntity: Object) =>
        actionCreator(actionTypes.ADD_DATA_ENTRY_RELATIONSHIP)({ dataEntryId, itemId, relationship, newToEntity });

export const relationshipAlreadyExists =
    (dataEntryId: string, itemId: string, message: string) =>
        actionCreator(actionTypes.DATA_ENTRY_RELATIONSHIP_ALREADY_EXISTS)({ dataEntryId, itemId, message });