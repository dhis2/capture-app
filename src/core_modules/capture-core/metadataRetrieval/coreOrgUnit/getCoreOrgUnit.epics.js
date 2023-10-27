// @flow
import { ofType } from 'redux-observable';
import { catchError, mergeMap, concatMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { actionTypes, orgUnitFetched } from './coreOrgUnit.actions';
import { fetchCoreOrgUnit } from './fetchCoreOrgUnit';
import type { FetchOrgUnitPayload } from './coreOrgUnit.types';

export const getCoreOrgUnitEpic = (
    action$: InputObservable,
    store: ReduxStore,
    { querySingleResource }: ApiUtils,
) => action$.pipe(
    ofType(actionTypes.GET_ORGUNIT),
    concatMap((action: ReduxAction<FetchOrgUnitPayload, void>) => {
        const { organisationUnits } = store.value;
        const payload = action.payload;
        if (organisationUnits[payload.orgUnitId]) {
            return of(payload.onSuccess(organisationUnits[payload.orgUnitId]));
        }
        return from(fetchCoreOrgUnit(payload.orgUnitId, querySingleResource))
            .pipe(
                mergeMap(orgUnit =>
                    of(orgUnitFetched(orgUnit), payload.onSuccess(orgUnit))),
                catchError(error =>
                    (payload.onError ? of(payload.onError(error)) : of({}))),
            );
    }),
);
