// @flow
import { actionCreator } from '../../actions/actions.utils';
import type { CoreOrgUnit, FetchOrgUnitPayload } from './coreOrgUnit.types';

export const actionTypes = {
    GET_ORGUNIT: 'organisationUnits.GetOrgUnit',
    ORG_UNIT_FETCHED: 'organisationUnits.OrgUnitFetched',
};

// Public
export const getCoreOrgUnit = (payload: FetchOrgUnitPayload) => actionCreator(actionTypes.GET_ORGUNIT)(payload);

// Private
export const orgUnitFetched = (orgUnit: CoreOrgUnit) => actionCreator(actionTypes.ORG_UNIT_FETCHED)(orgUnit);
