// @flow
import { ofType } from 'redux-observable';
import { EMPTY } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { searchPageActionTypes } from './SearchPage.actions';
import { buildUrlQueryString } from '../../../utils/routing';
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

export const navigateToNewUserPageEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(searchPageActionTypes.NAVIGATE_TO_NEW_USER_PAGE),
        switchMap(() => {
            const { currentSelections: { programId, orgUnitId } } = store.value;
            history.push(`/new?${buildUrlQueryString({ programId, orgUnitId })}`);

            return EMPTY;
        }),
    );
