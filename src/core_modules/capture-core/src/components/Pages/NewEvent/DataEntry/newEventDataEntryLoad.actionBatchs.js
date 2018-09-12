// @flow
import { actionCreator } from '../../../../actions/actions.utils';
import { actionTypes } from './newEventDataEntry.actions';
import { loadNewDataEntry } from '../../../DataEntry/actions/dataEntryLoadNew.actions';
import getDataEntryKey from '../../../DataEntry/common/getDataEntryKey';
import {
    getRulesActionsForEvent,
} from '../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';
import EventProgram from '../../../../metaData/Program/EventProgram';
import getEventDateValidatorContainers from './fieldValidators/eventDate.validatorContainersGetter';

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

function convertNoteOut(dataEntryValue: string, prevValue: string) {
    return dataEntryValue ? [{ value: dataEntryValue }] : [];
}
function convertNoteIn(dataEntryValue: any) {
    if (Array.isArray(dataEntryValue) && dataEntryValue.length > 0) {
        return dataEntryValue[0].value;
    }
    return null;
}

const dataEntryId = 'singleEvent';
const itemId = 'newEvent';
const formId = getDataEntryKey(dataEntryId, itemId);

const dataEntryPropsToInclude = [
    {
        id: 'eventDate',
        type: 'DATE',
        validatorContainers: getEventDateValidatorContainers(),
    },
    {
        id: 'coordinate',
        type: 'COORDINATE',
    },
    {
        inId: 'notes',
        outId: 'notes',
        onConvertIn: convertNoteIn,
        onConvertOut: convertNoteOut,
    },
    {
        inId: 'status',
        outId: 'complete',
        onConvertIn: convertStatusIn,
        onConvertOut: convertStatusOut,
    },
];

export const openNewEventInDataEntry =
    (program: ?EventProgram, foundation: ?RenderFoundation, orgUnit: Object) => {
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

export const resetDataEntry = (program: ?EventProgram, foundation: ?RenderFoundation, orgUnit: Object) => {
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
        actionCreator(actionTypes.RESET_DATA_ENTRY)(),
    ];
};
