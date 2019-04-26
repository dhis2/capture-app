// @flow
import { actionCreator } from '../../../../../actions/actions.utils';
import { methods } from '../../../../../trackerOffline/trackerOfflineConfig.const';
import saveTypes from '../newEventSaveTypes';

export const batchActionTypes = {
    UPDATE_DATA_ENTRY_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH: 'UpdateDataEntryFieldForNewSingleEventActionsBatch',
    UPDATE_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH: 'UpdateFieldForNewSingleEventActionsBatch',
    OPEN_NEW_EVENT_IN_DATA_ENTRY_ACTIONS_BATCH: 'OpenNewEventInDataEntryActionsBatch',
    RESET_DATA_ENTRY_ACTIONS_BATCH: 'ResetDataEntryForNewEventActionsBatch',
    RULES_EFFECTS_ACTIONS_BATCH: 'RulesEffectsForNewSingleEventActionsBatch',
    SAVE_NEW_EVENT_ADD_ANOTHER_BATCH: 'SaveNewEventAddAnotherBatch',
};

export const actionTypes = {
    OPEN_NEW_EVENT_IN_DATA_ENTRY: 'OpenNewEventInDataEntry',
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForNewSingleEvent',
    REQUEST_SAVE_RETURN_TO_MAIN_PAGE: 'RequestSaveReturnToMainPageForNewSingleEvent',
    START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE: 'StartSaveAfterReturnedToMainPage',
    START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE: 'StartCancelSaveReturnToMainPageForNewSingleEvent',
    CANCEL_SAVE_NO_WORKING_LIST_UPDATE_NEEDED: 'CancelSaveNoWorkingListUpdateNeededForSingleEvent',
    CANCEL_SAVE_UPDATE_WORKING_LIST: 'CancelSaveUpdateWorkingListForSingleNewEvent',
    NEW_EVENT_SAVED_AFTER_RETURNED_TO_MAIN_PAGE: 'SingleNewEventSavedAfterReturnedToMainPage',
    SAVE_FAILED_FOR_NEW_EVENT_AFTER_RETURNED_TO_MAIN_PAGE: 'SaveFailedForNewSingleEventAfterReturnedToMainPage',
    SELECTIONS_NOT_COMPLETE_OPENING_NEW_EVENT: 'SelectionsNotCompleteOpeningNewEvent',
    START_ASYNC_UPDATE_FIELD_FOR_NEW_EVENT: 'StartAsyncUpdateFieldForNewEvent',
    REQUEST_SAVE_NEW_EVENT_ADD_ANOTHER: 'RequestSaveNewEventAddAnother',
    START_SAVE_NEW_EVENT_ADD_ANOTHER: 'startSaveNewEventAddAnother',
    NEW_EVENT_SAVED_ADD_ANOTHER: 'NewEventSavedAddAnother',
    SAVE_FAILED_FOR_NEW_EVENT_ADD_ANOTHER: 'SaveFailedForNewEventAddAnother',
    SET_NEW_EVENT_SAVE_TYPES: 'SetNewEventSaveTypes',
    RESET_DATA_ENTRY: 'ResetDataEntryForNewEvent',
    ADD_NEW_EVENT_NOTE: 'AddNewEventNote',
};

export const startRunRulesOnUpdateForNewSingleEvent = (actionData: { payload: Object}) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)(actionData);

export const requestSaveNewEventAndReturnToMainPage = (eventId: string, dataEntryId: string, formFoundation: Object) =>
    actionCreator(actionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE)(
        { eventId, dataEntryId, formFoundation }, { skipLogging: ['formFoundation'] },
    );

export const startSaveNewEventAfterReturnedToMainPage = (serverData: Object, selections: Object) =>
    actionCreator(actionTypes.START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE)({ selections }, {
        offline: {
            effect: {
                url: 'events',
                method: methods.POST,
                data: serverData,
            },
            commit: { type: actionTypes.NEW_EVENT_SAVED_AFTER_RETURNED_TO_MAIN_PAGE, meta: { selections } },
            rollback: { type: actionTypes.SAVE_FAILED_FOR_NEW_EVENT_AFTER_RETURNED_TO_MAIN_PAGE, meta: { selections } },
        },
    });

export const cancelNewEventAndReturnToMainPage = () =>
    actionCreator(actionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE)();

export const cancelNewEventNoWorkingListUpdateNeeded = () =>
    actionCreator(actionTypes.CANCEL_SAVE_NO_WORKING_LIST_UPDATE_NEEDED)();

export const cancelNewEventUpdateWorkingList = () =>
    actionCreator(actionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST)();

export const selectionsNotCompleteOpeningNewEvent = () =>
    actionCreator(actionTypes.SELECTIONS_NOT_COMPLETE_OPENING_NEW_EVENT)();

export const setNewEventSaveTypes = (newSaveTypes: ?Array<$Values<typeof saveTypes>>) =>
    actionCreator(actionTypes.SET_NEW_EVENT_SAVE_TYPES)({ saveTypes: newSaveTypes });

export const addNewEventNote = (itemId: string, dataEntryId: string, note: string) =>
    actionCreator(actionTypes.ADD_NEW_EVENT_NOTE)({ itemId, dataEntryId, note });

export const requestSaveNewEventAddAnother = (eventId: string, dataEntryId: string, formFoundation: Object) =>
    actionCreator(actionTypes.REQUEST_SAVE_NEW_EVENT_ADD_ANOTHER)({
        eventId,
        dataEntryId,
        formFoundation,
    }, { skipLogging: ['formFoundation'] });

export const startSaveNewEventAddAnother = (serverData: Object, selections: Object, clientId: string) =>
    actionCreator(actionTypes.START_SAVE_NEW_EVENT_ADD_ANOTHER)({ selections }, {
        offline: {
            effect: {
                url: 'events',
                method: methods.POST,
                data: serverData,
                clientId,
            },
            commit: { type: actionTypes.NEW_EVENT_SAVED_ADD_ANOTHER, meta: { selections } },
            rollback: { type: actionTypes.SAVE_FAILED_FOR_NEW_EVENT_ADD_ANOTHER, meta: { selections, clientId } },
        },
    });

export const startAsyncUpdateFieldForNewEvent =
    (
        fieldId: string,
        fieldLabel: string,
        formBuilderId: string,
        formId: string,
        callback: Function,
        dataEntryId: string,
        itemId: string,
    ) =>
        actionCreator(actionTypes.START_ASYNC_UPDATE_FIELD_FOR_NEW_EVENT)({
            fieldId,
            fieldLabel,
            formBuilderId,
            formId,
            callback,
            dataEntryId,
            itemId,
        });
