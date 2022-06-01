// @flow
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { searchPageActionTypes } from './SearchPage.actions';
import { lockedSelectorActionTypes } from '../../LockedSelector';
import { topBarActionsActionTypes } from '../../TopBarActions';
import { deriveURLParamsFromLocation, buildUrlQueryString } from '../../../utils/routing';
import { resetLocationChange } from '../../LockedSelector/QuickSelector/actions/QuickSelector.actions';

export const navigateBackToMainPageEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE),
        switchMap(() => {
            const { currentSelections: { programId, orgUnitId } } = store.value;
            history.push(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
            return new Promise((resolve) => {
                setTimeout(() => resolve(resetLocationChange()), 0);
            });
        }),
    );

export const openSearchPageLocationChangeEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.SEARCH_PAGE_OPEN, topBarActionsActionTypes.SEARCH_PAGE_OPEN),
        switchMap((action) => {
            const { orgUnitId, programId = action.payload.programId } = deriveURLParamsFromLocation();
            history.push(`/search?${buildUrlQueryString({ programId, orgUnitId })}`);
            return new Promise((resolve) => {
                setTimeout(() => resolve(resetLocationChange()), 0);
            });
        }));
