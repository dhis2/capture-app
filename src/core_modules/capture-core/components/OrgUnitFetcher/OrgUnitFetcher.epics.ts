import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';
import type { Action } from 'redux';
import { getCoreOrgUnit } from '../../metadataRetrieval/coreOrgUnit';
import { actionTypes, setCurrentOrgUnit, errorRetrievingOrgUnit } from './OrgUnitFetcher.actions';
import type { FetchOrgUnitActionPayload } from './OrgUnitFetcher.types';

export const orgUnitFetcherEpic = (
    action$: Observable<Action & { payload: FetchOrgUnitActionPayload }>,
) => action$.pipe(
    ofType(actionTypes.FETCH_ORG_UNIT),
    map(({ payload: { orgUnitId } }) => getCoreOrgUnit({
        orgUnitId,
        onSuccess: orgUnit => setCurrentOrgUnit(orgUnit),
        onError: errorRetrievingOrgUnit,
    })),
);
