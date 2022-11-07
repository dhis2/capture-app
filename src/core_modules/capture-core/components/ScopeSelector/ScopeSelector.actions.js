// @flow
import { actionCreator } from '../../actions/actions.utils';

export const scopeSelectorActionTypes = {
    ORG_UNIT_ID_SET: 'ScopeSelector.OrgUnitSet',
    RESET_ORG_UNIT_ID: 'ScopeSelector.ResetOrgUnitId',
};

export const setOrgUnitFromScopeSelector = (orgUnitId: string) =>
    actionCreator(scopeSelectorActionTypes.ORG_UNIT_ID_SET)({ orgUnitId });

export const resetOrgUnitIdFromScopeSelector = (previousOrgUnitId?: string) => actionCreator(scopeSelectorActionTypes.RESET_ORG_UNIT_ID)({ previousOrgUnitId });
