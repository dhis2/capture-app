// @flow
import { actionCreator } from '../../actions/actions.utils';

export const scopeSelectorActionTypes = {
    ORG_UNIT_ID_SET: 'ScopeSelector.OrgUnitSet',
};

export const setOrgUnitFromScopeSelector = (orgUnitId: string) =>
    actionCreator(scopeSelectorActionTypes.ORG_UNIT_ID_SET)({ orgUnitId });
