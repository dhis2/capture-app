// @flow
import { actionCreator } from '../../../../actions/actions.utils';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';
import { loadEditDataEntry } from '../../../DataEntry/actions/dataEntryLoadEdit.actions';
import {
    getRulesActionsForEvent,
} from '../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import Program from '../../../../metaData/Program/Program';
import { methods } from '../../../../trackerOffline/trackerOfflineConfig.const';

import type { ClientEventContainer } from '../../../../events/eventRequests';

export const batchActionTypes = {
    UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH: 'UpdateFieldForEditSingleEventActionsBatch',
    RULES_EFFECTS_ACTIONS_BATCH: 'RulesEffectsForEditSingleEventActionsBatch',
};

export const actionTypes = {
    OPEN_EVENT_FOR_EDIT_IN_DATA_ENTRY: 'OpenSingleEventForEditInDataEntry',
    PREREQUISITES_ERROR_OPENING_EVENT_FOR_EDIT_IN_DATA_ENTRY: 'PrerequisitesErrorOpeningSingleEventForEditInDataEntry',
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForEditSingleEvent',
    REQUEST_SAVE_RETURN_TO_MAIN_PAGE: 'RequestSaveReturnToMainPageForEditSingleEvent',
    START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE: 'StartSaveAfterReturnedToMainPageForEditEvent',
    EVENT_UPDATED_AFTER_RETURN_TO_MAIN_PAGE: 'SingleEventUpdatedAfterReturnToMainPage',
    EVENT_UPDATE_FAILED_AFTER_RETURN_TO_MAIN_PAGE: 'SingleEventUpdateFailedAfterReturnToMainPage',
    START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE: 'CancelUpdateForSingleEventReturnToMainPage',
    NO_WORKING_LIST_UPDATE_NEEDED_AFTER_CANCEL_UPDATE: 'NoWorkingListUpdateNeededAfterEventUpdateCancelled',
    UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE: 'UpdateWorkingListAfterEventUpdateCancelled',
};

export const editEventIds = {
    dataEntryId: 'singleEvent',
    itemId: 'editEvent',
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

export const openEventForEditInDataEntry =
    (eventContainer: ClientEventContainer, orgUnit: Object, foundation: RenderFoundation, program: Program) => {
        const dataEntryId = editEventIds.dataEntryId;
        const itemId = editEventIds.itemId;
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
        const key = getDataEntryKey(dataEntryId, itemId);
        const dataEntryActions =
            loadEditDataEntry(
                dataEntryId,
                itemId,
                eventContainer.event,
                eventContainer.values,
                dataEntryPropsToInclude,
                foundation,
                {
                    eventId: eventContainer.event.eventId,
                },
            );

        return [
            ...dataEntryActions,
            ...getRulesActionsForEvent(
                program,
                foundation,
                key,
                orgUnit,
                { ...eventContainer.event, ...eventContainer.values }),
            actionCreator(actionTypes.OPEN_EVENT_FOR_EDIT_IN_DATA_ENTRY)(),
        ];
    };

export const prerequisitesErrorOpeningEventForEditInDataEntry = (message: string) =>
    actionCreator(actionTypes.PREREQUISITES_ERROR_OPENING_EVENT_FOR_EDIT_IN_DATA_ENTRY)(message);

export const startRunRulesOnUpdateForEditSingleEvent = (actionData: { payload: Object}) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)(actionData);

export const requestSaveReturnToMainPage = (itemId: string, dataEntryId: string, formFoundation: Object) =>
    actionCreator(actionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE)({ itemId, dataEntryId, formFoundation });

export const startSaveEditEventAfterReturnedToMainPage = (eventId: string, serverData: Object) =>
    actionCreator(actionTypes.START_SAVE_AFTER_RETURNED_TO_MAIN_PAGE)(null, {
        offline: {
            effect: {
                url: `events/${eventId}`,
                method: methods.UPDATE,
                data: serverData,
            },
            commit: { type: actionTypes.EVENT_UPDATED_AFTER_RETURN_TO_MAIN_PAGE },
            rollback: { type: actionTypes.EVENT_UPDATE_FAILED_AFTER_RETURN_TO_MAIN_PAGE },
        },
    });

export const startCancelSaveReturnToMainPage = () =>
    actionCreator(actionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE)();

export const noWorkingListUpdateNeededAfterUpdateCancelled = () =>
    actionCreator(actionTypes.NO_WORKING_LIST_UPDATE_NEEDED_AFTER_CANCEL_UPDATE)();

export const updateWorkingListAfterUpdateCancelled = () =>
    actionCreator(actionTypes.UPDATE_WORKING_LIST_AFTER_CANCEL_UPDATE)();
