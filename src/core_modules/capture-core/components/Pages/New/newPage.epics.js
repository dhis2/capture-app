// @flow
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { topBarActionsActionTypes } from '../../TopBarActions/TopBarActions.actions';
import { buildUrlQueryString, getLocationQuery } from '../../../utils/routing';
import { resetLocationChange } from '../../ScopeSelector/QuickSelector/actions/QuickSelector.actions';

export const openNewRegistrationPageFromLockedSelectorEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(topBarActionsActionTypes.NEW_REGISTRATION_PAGE_OPEN),
        switchMap((action) => {
            const params = getLocationQuery();
            const orgUnitId = params.orgUnitId || store.value.currentSelections.orgUnitId;
            const programId = params.programId || action.payload.programId || store.value.currentSelections.programId;
            history.push(`/new?${buildUrlQueryString({ programId, orgUnitId })}`);
            return new Promise((resolve) => {
                setTimeout(() => resolve(resetLocationChange()), 0);
            });
        }));
