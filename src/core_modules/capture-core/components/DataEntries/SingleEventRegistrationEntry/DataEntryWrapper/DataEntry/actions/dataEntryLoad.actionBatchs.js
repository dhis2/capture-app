// @flow
import { actionCreator } from '../../../../../../actions/actions.utils';
import { actionTypes } from './dataEntry.actions';
import { loadNewDataEntry } from '../../../../../DataEntry/actions/dataEntryLoadNew.actions';
import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';
import { getApplicableRuleEffectsForEventProgram, updateRulesEffects } from '../../../../../../rules';
import type { RenderFoundation, EventProgram } from '../../../../../../metaData';
import { getEventDateValidatorContainers } from '../fieldValidators/eventDate.validatorContainersGetter';
import { convertGeometryOut, convertStatusIn, convertStatusOut } from '../../../../index';
import { getNoteValidatorContainers } from '../fieldValidators/note.validatorContainersGetter';

const dataEntryId = 'singleEvent';
const itemId = 'newEvent';
const formId = getDataEntryKey(dataEntryId, itemId);

type DataEntryPropsToInclude = Array<Object>;

const dataEntryPropsToInclude: DataEntryPropsToInclude = [
    {
        id: 'occurredAt',
        type: 'DATE',
        validatorContainers: getEventDateValidatorContainers(),
    },
    {
        clientId: 'geometry',
        dataEntryId: 'geometry',
        onConvertOut: convertGeometryOut,
    },
    {
        id: 'note',
        type: 'TEXT',
        validatorContainers: getNoteValidatorContainers(),
        clientIgnore: true,
    },
    {
        id: 'relationship',
        type: 'TEXT',
        clientIgnore: true,
    },
    {
        clientId: 'status',
        dataEntryId: 'complete',
        onConvertIn: convertStatusIn,
        onConvertOut: convertStatusOut,
    },
    {
        id: 'assignee',
    },
];

export const openNewEventInDataEntry =
    (program: EventProgram, foundation: ?RenderFoundation, orgUnit: Object) => {
        const dataEntryActions = loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude);

        const effects = getApplicableRuleEffectsForEventProgram({
            program,
            orgUnit,
        });

        return [
            ...dataEntryActions,
            updateRulesEffects(effects, formId),
            actionCreator(actionTypes.OPEN_NEW_EVENT_IN_DATA_ENTRY)(),
        ];
    };

export const resetDataEntry = (program: EventProgram, foundation: ?RenderFoundation, orgUnit: Object) => {
    const dataEntryActions = loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude);

    const effects = getApplicableRuleEffectsForEventProgram({
        program,
        orgUnit,
    });

    return [
        ...dataEntryActions,
        updateRulesEffects(effects, formId),
        actionCreator(actionTypes.RESET_DATA_ENTRY)(),
    ];
};
