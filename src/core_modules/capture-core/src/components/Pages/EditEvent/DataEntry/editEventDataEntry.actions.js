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

export const actionTypes = {
    OPEN_EVENT_FOR_EDIT_IN_DATA_ENTRY: 'OpenSingleEventForEditInDataEntry',
    PREREQUISITES_ERROR_OPENING_EVENT_FOR_EDIT_IN_DATA_ENTRY: 'PrerequisitesErrorOpeningSingleEventForEditInDataEntry',
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
        const dataEntryId = 'singleEvent';
        const itemId = 'editEvent';
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
            );

        return [
            ...dataEntryActions,
            ...getRulesActionsForEvent(program, foundation, key, orgUnit, { ...eventContainer.event, ...eventContainer.values }),
            actionCreator(actionTypes.OPEN_EVENT_FOR_EDIT_IN_DATA_ENTRY)(),
        ];
    };

export const prerequisitesErrorOpeningEventForEditInDataEntry = (message: string) =>
    actionCreator(actionTypes.PREREQUISITES_ERROR_OPENING_EVENT_FOR_EDIT_IN_DATA_ENTRY)(message);
