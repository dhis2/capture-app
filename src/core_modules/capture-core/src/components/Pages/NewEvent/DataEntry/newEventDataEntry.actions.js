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
    NEW_EVENT_SAVED: 'SingleNewEventSaved',
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

        return batchActions([
            ...dataEntryActions,
            ...getRulesActionsOnLoadForSingleNewEvent(programId, key, eventId, dataEntryId, orgUnit),
        ]);
    };

export const startRunRulesOnUpdateForNewSingleEvent = (actionData: { payload: Object}) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)(actionData);

export const startSaveNewEventAndReturnToMainPage = (eventId: string, dataEntryId: string, formFoundation: Object) =>
    actionCreator(actionTypes.START_SAVE_RETURN_TO_MAIN_PAGE)({ eventId, dataEntryId, formFoundation });

export const newEventSaved = () =>
    actionCreator(actionTypes.NEW_EVENT_SAVED)();
