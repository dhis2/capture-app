// @flow
import type { OrgUnitGroup } from '@dhis2/rules-engine-javascript';

// Make sure rules engine OrgUnit is a subset of this!
export type CoreOrgUnit = {|
    id: string,
    name: string,  // this is the translated name (displayName)
    code: string,
    path: string,
    groups: Array<OrgUnitGroup>,
|};


type ActionCreator<T> = (payload: T) => ReduxAction<any, any>;

export type FetchOrgUnitPayload = {
    orgUnitId: string,
    onSuccess: ActionCreator<CoreOrgUnit>,
    onError?: ActionCreator<any>,
};
