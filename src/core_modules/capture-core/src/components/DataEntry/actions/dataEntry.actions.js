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
    ASYNC_UPDATE_FIELD_FAILED: 'AsyncUpdateFieldFailed',
    ADD_NOTE: 'AddNote',
    REMOVE_NOTE: 'RemoveNote',
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
    ) =>
        actionCreator(
            actionTypes.UPDATE_FORM_FIELD)({ value, uiState, formId, formBuilderId, elementId, dataEntryId, itemId });

export const rulesExecutedPostUpdateField =
    (dataEntryId: string, itemId: string) =>
        actionCreator(actionTypes.RULES_EXECUTED_POST_UPDATE_FIELD)({ dataEntryId, itemId });

export const asyncUpdateFieldFailed =
    (message: string) =>
        actionCreator(actionTypes.ASYNC_UPDATE_FIELD_FAILED)({ message });

export const addNote =
    (dataEntryId: string, itemId: string, objectId: string, clientNote: Object, formNote: Object) =>
        actionCreator(actionTypes.ADD_NOTE)({ dataEntryId, itemId, objectId, clientNote, formNote });

export const removeNote =
    (dataEntryId: string, itemId: string, objectId: string, noteClientId: string) =>
        actionCreator(actionTypes.REMOVE_NOTE)({ dataEntryId, itemId, objectId, noteClientId });
