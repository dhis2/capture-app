// @flow
import i18n from '@dhis2/d2-i18n';
import { ofType } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import {
    scopeSelectorActionTypes,
    setCurrentOrgUnitBasedOnUrl,
    errorRetrievingOrgUnitBasedOnUrl,
} from './ScopeSelector.actions';

const orgUnitsQuery = id => ({ resource: 'organisationUnits', id });

export const fetchOrgUnitEpic = (
    action$: InputObservable,
    _: ReduxStore,
    { querySingleResource }: ApiUtils,
) =>
    action$.pipe(
        ofType(scopeSelectorActionTypes.FETCH_ORG_UNIT),
        switchMap(({ payload: { orgUnitId } }) =>
            from(querySingleResource(orgUnitsQuery(orgUnitId))).pipe(
                map(({ id, displayName: name }) =>
                    setCurrentOrgUnitBasedOnUrl({ id, name }),
                ),
            ),
        ),
        catchError(() =>
            of(
                errorRetrievingOrgUnitBasedOnUrl(
                    i18n.t('Could not get organisation unit'),
                ),
            ),
        ),
    );
