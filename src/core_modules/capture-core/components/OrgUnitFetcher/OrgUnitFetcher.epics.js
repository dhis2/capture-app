// @flow
import { ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { actionTypes, setCurrentOrgUnit, errorRetrievingOrgUnit } from './OrgUnitFetcher.actions';


const orgUnitsQuery = id => ({ resource: 'organisationUnits', id });

export const orgUnitFetcherEpic = (action$: InputObservable, _: ReduxStore, { querySingleResource }: ApiUtils,
) => action$.pipe(
    ofType(actionTypes.FETCH_ORG_UNIT),
    switchMap(({ payload: { orgUnitId } }) => from(querySingleResource(orgUnitsQuery(orgUnitId)))
        .pipe(map(({ id, displayName: name }) => setCurrentOrgUnit({ id, name }))))
    ,
    catchError(() => of(errorRetrievingOrgUnit())),
);
