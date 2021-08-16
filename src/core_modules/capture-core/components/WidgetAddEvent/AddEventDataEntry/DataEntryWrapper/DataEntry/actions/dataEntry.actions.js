// @flow
import { actionCreator, actionPayloadAppender } from '../../../../../../actions/actions.utils';
import { effectMethods } from '../../../../../../trackerOffline';
import typeof { newEventSaveTypes } from '../newEventSaveTypes';

export const batchActionTypes = {
    UPDATE_DATA_ENTRY_FIELD_ADD_EVENT_ACTION_BATCH: 'UpdateDataEntryFieldForAddEventActionsBatch',
    UPDATE_FIELD_ADD_EVENT_ACTION_BATCH: 'UpdateFieldForAddEventActionsBatch',
    OPEN_ADD_EVENT_IN_DATA_ENTRY_ACTIONS_BATCH: 'OpenAddEventInDataEntryActionsBatch',
    RESET_DATA_ENTRY_ACTIONS_BATCH: 'ResetDataEntryForNewEventActionsBatch',
    RULES_EFFECTS_ACTIONS_BATCH: 'RulesEffectsForAddEventActionsBatch',
    SAVE_ADD_EVENT_ADD_ANOTHER_BATCH: 'SaveNewEventAddAnotherBatch',
};

export const actionTypes = {
    OPEN_ADD_EVENT_IN_DATA_ENTRY: 'OpenNewEventInDataEntry',
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForAddEvent',
    REQUEST_SAVE_RETURN_TO_OVERVIEW_PAGE: 'RequestSaveReturnToOverviewPageForAddEvent',
    START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE: 'StartSaveAfterReturnedToMainPage',
    START_CANCEL_SAVE_RETURN_TO_OVERVIEW_PAGE: 'StartCancelSaveReturnToOverviewPageForAddEvent',
    CANCEL_SAVE_NO_WORKING_LIST_UPDATE_NEEDED: 'CancelSaveNoWorkingListUpdateNeededForSingleEvent',
    CANCEL_SAVE_UPDATE_WORKING_LIST: 'CancelSaveUpdateWorkingListForSingleNewEvent',
    ADD_EVENT_SAVED_AFTER_RETURNED_TO_MAIN_PAGE: 'SingleNewEventSavedAfterReturnedToMainPage',
    SAVE_FAILED_FOR_ADD_EVENT_AFTER_RETURNED_TO_MAIN_PAGE: 'SaveFailedForAddEventAfterReturnedToMainPage',
    ADD_EVENT_IN_DATAENTRY_OPENING_CANCEL: 'NewEventInDataEntryOpeningCancel',
    START_ASYNC_UPDATE_FIELD_FOR_ADD_EVENT: 'StartAsyncUpdateFieldForNewEvent',
    REQUEST_SAVE_ADD_EVENT_ADD_ANOTHER: 'RequestSaveNewEventAddAnother',
    START_SAVE_ADD_EVENT_ADD_ANOTHER: 'startSaveNewEventAddAnother',
    ADD_EVENT_SAVED_ADD_ANOTHER: 'NewEventSavedAddAnother',
    SAVE_FAILED_FOR_ADD_EVENT_ADD_ANOTHER: 'SaveFailedForNewEventAddAnother',
    SET_ADD_EVENT_SAVE_TYPES: 'SetNewEventSaveTypes',
    RESET_DATA_ENTRY: 'ResetDataEntryForNewEvent',
    ADD_EVENT_NOTE: 'AddEventNote',
    ADD_EVENT_OPEN_NEW_RELATIONSHIP: 'NewEventOpenNewRelationship',
    SAVE_ADD_EVENT_RELATIONSHIPS_IF_EXISTS: 'SaveNewEventRelationshipsIfExists',
    START_SAVE_ADD_EVENT_RELATIONSHIPS: 'StartSaveNewEventRelationships',
    ADD_EVENT_RELATIONSHIPS_SAVED: 'NewEventRelationshipsSaved',
    SAVE_FAILED_FOR_ADD_EVENT_RELATIONSHIPS: 'SaveFailedForNewEventRelationships',
    CANCEL_SAVE_INITIALIZE_WORKING_LISTS: 'CancelSaveInitializeWorkingListsForSingleNewEvent',
    START_SAVE_TEI_FOR_ADD_EVENT_RELATIONSHIPS: 'StartSaveTeiForNewEventRelationships',
    TEI_FOR_ADD_EVENT_RELATIONSHIPS_SAVED: 'TeiForNewEventRelationshipSaved',
    SAVE_FAILED_FOR_ADD_EVENT_RELATIONSHIPS_TEI: 'SaveFailedForNewEventRelationshipTei',
    SCROLLED_TO_RELATIONSHIPS: 'NewEventScrolledToRelationships',
};

export const startRunRulesOnUpdateForAddEvent = (actionData: { payload: Object}) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)(actionData);

export const requestSaveAddEventAndReturnToOverviewPage = (eventId: string, dataEntryId: string, formFoundation: Object, completed?: boolean) =>
    actionCreator(actionTypes.REQUEST_SAVE_RETURN_TO_OVERVIEW_PAGE)(
        { eventId, dataEntryId, formFoundation, completed }, { skipLogging: ['formFoundation'] },
    );

export const newEventSavedAfterReturnedToMainPage = (selections: Object) =>
    actionCreator(actionTypes.ADD_EVENT_SAVED_AFTER_RETURNED_TO_MAIN_PAGE)(null, { selections });

export const startSaveNewEventAfterReturnedToMainPage = (serverData: Object, relationshipData: ?Object, selections: Object) => {
    const actionType = actionTypes.START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE;
    return actionCreator(actionType)({ selections }, {
        offline: {
            effect: {
                url: 'events',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: { type: actionTypes.SAVE_ADD_EVENT_RELATIONSHIPS_IF_EXISTS, meta: { selections, relationshipData, triggerAction: actionType } },
            rollback: { type: actionTypes.SAVE_FAILED_FOR_ADD_EVENT_AFTER_RETURNED_TO_MAIN_PAGE, meta: { selections } },
        },
    });
};


export const startSaveNewEventRelationships = (serverData: Object, selections: Object, triggerAction: string) =>
    actionCreator(actionTypes.START_SAVE_ADD_EVENT_RELATIONSHIPS)({ selections }, {
        offline: {
            effect: {
                url: 'relationships',
                method: effectMethods.POST,
                data: serverData,
            },
            commit: { type: actionTypes.ADD_EVENT_RELATIONSHIPS_SAVED, meta: { selections, triggerAction } },
            rollback: { type: actionTypes.SAVE_FAILED_FOR_ADD_EVENT_RELATIONSHIPS, meta: { selections, triggerAction } },
        },
    });

export const startSaveTeiForNewEventRelationship = (teiPayload: Object, selections: Object, triggerAction: string, relationshipData: Array<any>, relationshipClientId: string) =>
    actionCreator(actionTypes.START_SAVE_TEI_FOR_ADD_EVENT_RELATIONSHIPS)({ selections }, {
        offline: {
            effect: {
                url: 'trackedEntityInstances',
                method: effectMethods.POST,
                data: teiPayload,
            },
            commit: { type: actionTypes.TEI_FOR_ADD_EVENT_RELATIONSHIPS_SAVED, meta: { selections, triggerAction, relationshipData, relationshipClientId } },
            rollback: { type: actionTypes.SAVE_FAILED_FOR_ADD_EVENT_RELATIONSHIPS_TEI, meta: { selections, triggerAction } },
        },
    });


export const cancelAddEventAndReturnToOverviewPage = () =>
    actionCreator(actionTypes.START_CANCEL_SAVE_RETURN_TO_OVERVIEW_PAGE)();

export const cancelNewEventNoWorkingListUpdateNeeded = () =>
    actionCreator(actionTypes.CANCEL_SAVE_NO_WORKING_LIST_UPDATE_NEEDED)();

export const cancelNewEventUpdateWorkingList = () =>
    actionCreator(actionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST)();

export const cancelNewEventInitializeWorkingLists = () =>
    actionCreator(actionTypes.CANCEL_SAVE_INITIALIZE_WORKING_LISTS)();

export const cancelOpenNewEventInDataEntry = () =>
    actionCreator(actionTypes.ADD_EVENT_IN_DATAENTRY_OPENING_CANCEL)();

export const setNewEventSaveTypes = (newSaveTypes: ?Array<$Values<newEventSaveTypes>>) =>
    actionCreator(actionTypes.SET_ADD_EVENT_SAVE_TYPES)({ saveTypes: newSaveTypes });

export const addNewEventNote = (itemId: string, dataEntryId: string, note: string) =>
    actionCreator(actionTypes.ADD_EVENT_NOTE)({ itemId, dataEntryId, note });

export const requestSaveNewEventAddAnother = (eventId: string, dataEntryId: string, formFoundation: Object) =>
    actionCreator(actionTypes.REQUEST_SAVE_ADD_EVENT_ADD_ANOTHER)({
        eventId,
        dataEntryId,
        formFoundation,
    }, { skipLogging: ['formFoundation'] });

export const startSaveNewEventAddAnother =
(
    serverData: Object,
    relationshipData: ?Object,
    selections: Object,
    clientId: string,
) => {
    const actionType = actionTypes.START_SAVE_ADD_EVENT_ADD_ANOTHER;
    return actionCreator(actionTypes.START_SAVE_ADD_EVENT_ADD_ANOTHER)({ selections }, {
        offline: {
            effect: {
                url: 'events',
                method: effectMethods.POST,
                data: serverData,
                clientId,
            },
            commit: { type: actionTypes.SAVE_ADD_EVENT_RELATIONSHIPS_IF_EXISTS, meta: { selections, relationshipData, triggerAction: actionType } },
            rollback: { type: actionTypes.SAVE_FAILED_FOR_ADD_EVENT_ADD_ANOTHER, meta: { selections, clientId } },
        },
    });
};

export const newEventSavedAddAnother = (selections: Object) =>
    actionCreator(actionTypes.ADD_EVENT_SAVED_ADD_ANOTHER)(null, { selections });

export const startAsyncUpdateFieldForNewEvent = (
    innerAction: ReduxAction<any, any>,
    onSuccess: Function,
    onError: Function,
) =>
    actionPayloadAppender(innerAction)({ onSuccess, onError });

export const newEventOpenNewRelationship = (eventId: string, dataEntryId: string) =>
    actionCreator(actionTypes.ADD_EVENT_OPEN_NEW_RELATIONSHIP)({ eventId, dataEntryId });

export const scrolledToRelationships = () =>
    actionCreator(actionTypes.SCROLLED_TO_RELATIONSHIPS)();
