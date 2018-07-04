// @flow
import { actionCreator } from '../../../../actions/actions.utils';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';
import {
    getRulesActionsForEvent,
} from '../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import EventProgram from '../../../../metaData/Program/EventProgram';
import { methods } from '../../../../trackerOffline/trackerOfflineConfig.const';
import getEventDateValidatorContainers from './fieldValidators/eventDate.validatorContainersGetter';

export const batchActionTypes = {
    UPDATE_FIELD_NEW_SINGLE_EVENT_ACTION_BATCH: 'UpdateFieldForNewSingleEventActionsBatch',
    OPEN_NEW_EVENT_IN_DATA_ENTRY_ACTIONS_BATCH: 'OpenNewEventInDataEntryActionsBatch',
    RULES_EFFECTS_ACTIONS_BATCH: 'RulesEffectsForNewSingleEventActionsBatch',
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
    CANCEL_NEW_EVENT_FROM_INCOMPLETE_SELECTIONS_RETURN_TO_MAIN_PAGE: 'CancelNewEventFromIncompleteSelectionAndReturnToMainPage',
    START_ASYNC_UPDATE_FIELD: 'StartAsyncUpdateField',
};

function convertStatusIn(value: string) {
    if (value === 'COMPLETED') {
        return 'true';
    }
    return null;
}

function convertStatusOut(dataEntryValue: string, prevValue: string) {
    if (dataEntryValue === 'true' && prevValue !== 'COMPLETED') {
        return 'COMPLETED';
    }

    if (!dataEntryValue && prevValue === 'COMPLETED') {
        return 'ACTIVE';
    }
    return prevValue;
}

export const openNewEventInDataEntry =
    (program: ?EventProgram, foundation: ?RenderFoundation, orgUnit: Object) => {
        const dataEntryId = 'singleEvent';
        const itemId = 'newEvent';
        const dataEntryPropsToInclude = [
            {
                id: 'eventDate',
                type: 'DATE',
                validatorContainers: getEventDateValidatorContainers(),
            },
            {
                inId: 'status',
                outId: 'complete',
                onConvertIn: convertStatusIn,
                onConvertOut: convertStatusOut,
            },
        ];
        const formId = getDataEntryKey(dataEntryId, itemId);
        const dataEntryActions = loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude);

        const rulesActions = getRulesActionsForEvent(
            program,
            foundation,
            formId,
            orgUnit,
        );

        return [
            ...dataEntryActions,
            ...rulesActions,
            actionCreator(actionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY)(),
        ];
    };

export const startRunRulesOnUpdateForNewSingleEvent = (actionData: { payload: Object}) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)(actionData);

export const requestSaveNewEventAndReturnToMainPage = (eventId: string, dataEntryId: string, formFoundation: Object) =>
    actionCreator(actionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE)({ eventId, dataEntryId, formFoundation });

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

export const cancelNewEventFromIncompleteSelectionAndReturnToMainPage = () =>
    actionCreator(actionTypes.CANCEL_NEW_EVENT_FROM_INCOMPLETE_SELECTIONS_RETURN_TO_MAIN_PAGE)();

export const startAsyncUpdateField = (fieldId: string, formBuilderId: string, formId: string, callback: Function, dataEntryId: string, itemId: string) =>
    actionCreator(actionTypes.START_ASYNC_UPDATE_FIELD)({
        fieldId,
        formBuilderId,
        formId,
        callback,
        dataEntryId,
        itemId,
    });
