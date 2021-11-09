// @flow

import { convertGeometryOut } from 'capture-core/components/DataEntries/converters';
import { loadNewDataEntry } from '../../DataEntry/actions/dataEntryLoadNew.actions';
import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { getRulesActionsForEvent } from '../../../rules/actionsCreator';
import type { RenderFoundation } from '../../../metaData';

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

export const getOpenDataEntryActions = (orgUnit: Object, dataEntryId: string, itemId: string) =>
    loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude);

export const getRulesActions = (foundation: RenderFoundation, orgUnit: Object, dataEntryId: string, itemId: string) => {
    const formId = getDataEntryKey(dataEntryId, itemId);
    // TODO  DHIS2-11878 apply the programRules
    // $FlowFixMe[incompatible-call]
    return getRulesActionsForEvent({ programRules: [] }, foundation, formId, orgUnit);
};
