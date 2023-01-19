// @flow
import { actionCreator } from '../../actions/actions.utils';

export const scopeSelectorActionTypes = {
    ORG_UNIT_ID_SET: 'ScopeSelector.OrgUnitSet',
    RESET_ORG_UNIT_ID: 'ScopeSelector.ResetOrgUnitId',
    CANCEL_CONTEXT_CHANGE: 'ScopeSelector.CancelContextChange',
    CHANGE_CONTEXT_WHILE_SAVING: 'ScopeSelector.ChangeContextWhileSaving',
};

export const setOrgUnitFromScopeSelector = (orgUnitId: string) =>
    actionCreator(scopeSelectorActionTypes.ORG_UNIT_ID_SET)({ orgUnitId });

export const resetOrgUnitIdFromScopeSelector = (previousOrgUnitId?: string) => actionCreator(scopeSelectorActionTypes.RESET_ORG_UNIT_ID)({ previousOrgUnitId });

export const cancelContextChange = () => actionCreator(scopeSelectorActionTypes.CANCEL_CONTEXT_CHANGE)();

export const changeContextWhileSaving = () => actionCreator(scopeSelectorActionTypes.CHANGE_CONTEXT_WHILE_SAVING)();
