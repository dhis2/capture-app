// @flow
import { actionCreator } from '../../../../actions/actions.utils';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';
import { loadEditDataEntry } from '../../../DataEntry/actions/dataEntryLoadEdit.actions';
import {
    getRulesActionsForEvent,
} from '../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import Program from '../../../../metaData/Program/Program';
import type { ClientEventContainer } from '../../../../events/eventRequests';

export const batchActionTypes = {
    UPDATE_FIELD_EDIT_SINGLE_EVENT_ACTION_BATCH: 'UpdateFieldForEditSingleEventActionsBatch',
    RULES_EFFECTS_ACTIONS_BATCH: 'RulesEffectsForEditSingleEventActionsBatch',
};

export const actionTypes = {
    OPEN_EVENT_FOR_EDIT_IN_DATA_ENTRY: 'OpenSingleEventForEditInDataEntry',
    PREREQUISITES_ERROR_OPENING_EVENT_FOR_EDIT_IN_DATA_ENTRY: 'PrerequisitesErrorOpeningSingleEventForEditInDataEntry',
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForEditSingleEvent',
    START_SAVE_RETURN_TO_MAIN_PAGE: 'StartSaveReturnToMainPageForEditEvent',
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
            ...getRulesActionsForEvent(program, foundation, key, orgUnit, { ...eventContainer.event, ...eventContainer.values }),
            actionCreator(actionTypes.OPEN_EVENT_FOR_EDIT_IN_DATA_ENTRY)(),
        ];
    };

export const prerequisitesErrorOpeningEventForEditInDataEntry = (message: string) =>
    actionCreator(actionTypes.PREREQUISITES_ERROR_OPENING_EVENT_FOR_EDIT_IN_DATA_ENTRY)(message);

export const startRunRulesOnUpdateForEditSingleEvent = (actionData: { payload: Object}) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)(actionData);

export const startSaveReturnToMainPage = () =>
    actionCreator(actionTypes.START_SAVE_RETURN_TO_MAIN_PAGE)();
