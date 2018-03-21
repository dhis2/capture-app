// @flow
import { actionCreator } from '../../../actions/actions.utils';

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
    (eventId: string, id: string) => actionCreator(actionTypes.SAVE_VALIDATION_FALED)({ eventId, id });

export const saveAbort =
    (eventId: string, id: string) => actionCreator(actionTypes.SAVE_ABORT)({ eventId, id });

export const updateField =
    (value: any, valueMeta: Object, fieldId: string, dataEntryId: string, eventId: string) =>
        actionCreator(actionTypes.UPDATE_FIELD)({ value, valueMeta, fieldId, dataEntryId, eventId });

export const updateFormField =
    (
        value: any,
        uiState: Object,
        elementId: string,
        sectionId: string,
        formId: string,
        dataEntryId: string,
        eventId: string,
    ) =>
        actionCreator(
            actionTypes.UPDATE_FORM_FIELD)({ value, uiState, formId, sectionId, elementId, dataEntryId, eventId });
