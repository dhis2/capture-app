// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { getCoreOrgUnit } from '../../metadataRetrieval/coreOrgUnit';
import { actionTypes, setCurrentOrgUnit, errorRetrievingOrgUnit } from './OrgUnitFetcher.actions';

export const orgUnitFetcherEpic = (action$: InputObservable) => action$.pipe(
    ofType(actionTypes.FETCH_ORG_UNIT),
    map(({ payload: { orgUnitId } }) => getCoreOrgUnit({
        orgUnitId,
        onSuccess: orgUnit => setCurrentOrgUnit(orgUnit),
        onError: errorRetrievingOrgUnit,
    })),
);
