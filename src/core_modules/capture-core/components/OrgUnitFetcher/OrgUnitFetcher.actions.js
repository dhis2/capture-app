// @flow

import { actionCreator } from '../../actions/actions.utils';
import type { ReduxOrgUnit } from '../../redux/organisationUnits';

export const actionTypes = {
    FETCH_ORG_UNIT: 'OrgUnitFetcher.FetchOrgUnit',
    FETCH_ORG_UNIT_SUCCESS: 'OrgUnitFetcher.FetchOrgUnitSuccess',
    FETCH_ORG_UNIT_FAILURE: 'OrgUnitFetcher.FetchOrgUnitFailure',
};

export const fetchOrgUnit = (orgUnitId: string) =>
    actionCreator(actionTypes.FETCH_ORG_UNIT)({ orgUnitId });

export const setCurrentOrgUnit = (orgUnit: ReduxOrgUnit) => actionCreator(actionTypes.FETCH_ORG_UNIT_SUCCESS)(orgUnit);

export const errorRetrievingOrgUnit = () => actionCreator(actionTypes.FETCH_ORG_UNIT_FAILURE)();
