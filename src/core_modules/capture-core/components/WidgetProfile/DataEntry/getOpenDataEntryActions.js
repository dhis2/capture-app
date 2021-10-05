// @flow

import { convertGeometryOut } from 'capture-core/components/DataEntries/converters';
import { loadNewDataEntry } from '../../DataEntry/actions/dataEntryLoadNew.actions';
import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { getRulesActionsForEvent } from '../../../rules/actionsCreator';
import type { RenderFoundation, TrackerProgram } from '../../../metaData';

type DataEntryPropsToInclude = Array<Object>;

const dataEntryPropsToInclude: DataEntryPropsToInclude = [
    {
        clientId: 'geometry',
        dataEntryId: 'geometry',
        onConvertOut: convertGeometryOut,
    },
    {
        id: 'assignee',
    },
];

export const getOpenDataEntryActions = (
    program: TrackerProgram,
    foundation: RenderFoundation,
    orgUnit: Object,
    dataEntryId: string,
    itemId: string,
) => {
    const dataEntryActions = loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude);
    const formId = getDataEntryKey(dataEntryId, itemId);
    const rulesActions = getRulesActionsForEvent(program, foundation, formId, orgUnit);

    return [...dataEntryActions, ...rulesActions];
};
