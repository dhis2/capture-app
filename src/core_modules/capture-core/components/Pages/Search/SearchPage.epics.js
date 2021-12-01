// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { buildUrlQueryString } from '../../../utils/routing';
import { deriveUrlQueries } from '../../../utils/url';
import { lockedSelectorActionTypes } from '../../LockedSelector';
import { topBarActionsActionTypes } from '../../TopBarActions';
import { searchPageActionTypes } from './SearchPage.actions';

export const navigateBackToMainPageEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE),
        map(() => {
            const { currentSelections: { programId, orgUnitId } } = store.value;
            return push(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
        }),
    );

export const openSearchPageLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.SEARCH_PAGE_OPEN, topBarActionsActionTypes.SEARCH_PAGE_OPEN),
        map(() => {
            const { programId, orgUnitId } = deriveUrlQueries(store.value);
            return push(`/search?${buildUrlQueryString({ programId, orgUnitId })}`);
        }));
