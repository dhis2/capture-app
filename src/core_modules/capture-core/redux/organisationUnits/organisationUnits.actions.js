// @flow
import { actionCreator } from '../../actions/actions.utils';
import type { ReduxOrgUnit } from './organisationUnits.types';

export const actionTypes = {
    GET_ORGUNIT: 'organisationUnits.GetOrgUnit',
    ORG_UNIT_FETCHED: 'organisationUnits.OrgUnitFetched',
};

type ActionCreator<T> = (payload: T) => ReduxAction<any, any>;

// Public
export type FetchOrgUnitPayload = {
    orgUnitId: string,
    onSuccess: ActionCreator<ReduxOrgUnit>,
    onError?: ActionCreator<any>,
}
export const getOrgUnit = (payload: FetchOrgUnitPayload) => actionCreator(actionTypes.GET_ORGUNIT)(payload);

// Private
export const orgUnitFetched = (orgUnit: ReduxOrgUnit) => actionCreator(actionTypes.ORG_UNIT_FETCHED)(orgUnit);
