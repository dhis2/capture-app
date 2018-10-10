// @flow
import { actionCreator } from '../../../../../actions/actions.utils';
import { actionTypes } from './dataEntry.actions';
import { loadNewDataEntry } from '../../../../DataEntry/actions/dataEntryLoadNew.actions';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import {
    getRulesActionsForEvent,
} from '../../../../../rulesEngineActionsCreator/rulesEngineActionsCreatorForEvent';
import RenderFoundation from '../../../../../metaData/RenderFoundation/RenderFoundation';
import EventProgram from '../../../../../metaData/Program/EventProgram';
import getEventDateValidatorContainers from '../fieldValidators/eventDate.validatorContainersGetter';
import {
    convertGeometryOut,
    convertNoteIn,
    convertNoteOut,
    convertStatusIn,
    convertStatusOut,
} from '../../../crossPage/converters';

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
        clientId: 'geometry',
        dataEntryId: 'geometry',
        onConvertOut: convertGeometryOut,
    },
    {
        clientId: 'notes',
        dataEntryId: 'notes',
        onConvertIn: convertNoteIn,
        onConvertOut: convertNoteOut,
    },
    {
        clientId: 'status',
        dataEntryId: 'complete',
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
