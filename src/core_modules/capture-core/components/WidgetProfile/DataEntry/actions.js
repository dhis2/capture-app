// @flow
import { convertGeometryOut } from 'capture-core/components/DataEntries/converters';
import { actionCreator, actionPayloadAppender } from '../../../actions/actions.utils';
import { loadNewDataEntry } from '../../DataEntry/actions/dataEntryLoadNew.actions';
import { getDataEntryKey } from '../../DataEntry/common/getDataEntryKey';
import { getRulesActionsForEvent } from '../../../rules/actionsCreator';

export const actionTypes = {
    START_RUN_RULES_ON_UPDATE: 'StartRunRulesOnUpdateForNewProfile',
};

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

export const startRunRulesOnUpdateForNewProfile = (payload: any, uid: string, orgUnit: any, program: any) =>
    actionCreator(actionTypes.START_RUN_RULES_ON_UPDATE)({ innerPayload: payload, uid, orgUnit, program });

export const startAsyncUpdateFieldForNewProfile = (
    innerAction: ReduxAction<any, any>,
    onSuccess: Function,
    onError: Function,
) => actionPayloadAppender(innerAction)({ onSuccess, onError });

export const getOpenDataEntryActions = (orgUnit: any, dataEntryId: string, itemId: string) =>
    loadNewDataEntry(dataEntryId, itemId, dataEntryPropsToInclude);

export const getRulesActions = (program: any, orgUnit: any, dataEntryId: string, itemId: string) => {
    const formId = getDataEntryKey(dataEntryId, itemId);
    return getRulesActionsForEvent(program, program.enrollment.foundation, formId, orgUnit);
};
