// @flow
import { batchActions } from 'redux-batched-actions';
import { actionCreator } from '../../../../actions/actions.utils';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';
import {
    getRulesActionsOnLoadForSingleNewEvent,
} from '../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';


export const actionTypes = {
    OPEN_NEW_EVENT_IN_DATA_ENTRY: 'OpenNewEventInDataEntry',
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForNewSingleEvent',
    START_SAVE_RETURN_TO_MAIN_PAGE: 'StartSaveReturnToMainPageForNewSingleEvent',
    START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE: 'StartCancelSaveReturnToMainPageForNewSingleEvent',
    CANCEL_SAVE_NO_WORKING_LIST_UPDATE_NEEDED: 'CancelSaveNoWorkingListUpdateNeededForSingleEvent',
    CANCEL_SAVE_UPDATE_WORKING_LIST: 'CancelSaveUpdateWorkingListForSingleNewEvent',
    NEW_EVENT_SAVED_AFTER_RETURNED_TO_MAIN_PAGE: 'SingleNewEventSavedAfterReturnedToMainPage',
    SAVE_FAILED_FOR_NEW_EVENT_AFTER_RETURNED_TO_MAIN_PAGE: 'SaveFailedForNewSingleEventAfterReturnedToMainPage',
    SELECTIONS_NOT_COMPLETE_OPENING_NEW_EVENT: 'SelectionsNotCompleteOpeningNewEvent',
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
    (programId: string, orgUnit: Object) => {
        const dataEntryId = 'singleEvent';
        const eventId = 'newEvent';
        const dataEntryPropsToInclude = [
            {
                id: 'eventDate',
                type: 'DATE',
            },
            {
                inId: 'status',
                outId: 'complete',
                onConvertIn: convertStatusIn,
                onConvertOut: convertStatusOut,
            },
        ];
        const key = getDataEntryKey(dataEntryId, eventId);
        const dataEntryActions = loadNewDataEntry(dataEntryId, eventId, dataEntryPropsToInclude);

        return [
            ...dataEntryActions,
            ...getRulesActionsOnLoadForSingleNewEvent(programId, key, eventId, dataEntryId, orgUnit),
            actionCreator(actionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY)(),
        ];
    };

export const startRunRulesOnUpdateForNewSingleEvent = (actionData: { payload: Object}) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)(actionData);

export const startSaveNewEventAndReturnToMainPage = (eventId: string, dataEntryId: string, formFoundation: Object) =>
    actionCreator(actionTypes.START_SAVE_RETURN_TO_MAIN_PAGE)({ eventId, dataEntryId, formFoundation });

export const cancelNewEventAndReturnToMainPage = () =>
    actionCreator(actionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE)();

export const cancelNewEventNoWorkingListUpdateNeeded = () =>
    actionCreator(actionTypes.CANCEL_SAVE_NO_WORKING_LIST_UPDATE_NEEDED)();

export const cancelNewEventUpdateWorkingList = () =>
    actionCreator(actionTypes.CANCEL_SAVE_UPDATE_WORKING_LIST)();

export const newEventSavedAfterReturnedToMainPage = () =>
    actionCreator(actionTypes.NEW_EVENT_SAVED_AFTER_RETURNED_TO_MAIN_PAGE)();

export const saveFailedForNewEventAfterReturnedToMainPage = (message: string) =>
    actionCreator(actionTypes.SAVE_FAILED_FOR_NEW_EVENT_AFTER_RETURNED_TO_MAIN_PAGE)(message);

export const selectionsNotCompleteOpeningNewEvent = () =>
    actionCreator(actionTypes.SELECTIONS_NOT_COMPLETE_OPENING_NEW_EVENT)();
