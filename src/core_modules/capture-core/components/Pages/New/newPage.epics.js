// @flow
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { lockedSelectorActionTypes } from '../../LockedSelector/LockedSelector.actions';
import { topBarActionsActionTypes } from '../../TopBarActions/TopBarActions.actions';
import { buildUrlQueryString, deriveURLParamsFromLocation } from '../../../utils/routing';
import { resetLocationChange } from '../../LockedSelector/QuickSelector/actions/QuickSelector.actions';

export const openNewRegistrationPageFromLockedSelectorEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.NEW_REGISTRATION_PAGE_OPEN, topBarActionsActionTypes.NEW_REGISTRATION_PAGE_OPEN),
        switchMap(() => {
            const params = deriveURLParamsFromLocation();
            const orgUnitId = params.orgUnitId || store.value.currentSelections.orgUnitId;
            const programId = params.programId || store.value.currentSelections.programId;
            history.push(`/new?${buildUrlQueryString({ programId, orgUnitId })}`);
            return new Promise((resolve) => {
                setTimeout(() => resolve(resetLocationChange()), 0);
            });
        }));
