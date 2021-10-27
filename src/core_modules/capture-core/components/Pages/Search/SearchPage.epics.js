// @flow
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { searchPageActionTypes } from './SearchPage.actions';
import { lockedSelectorActionTypes } from '../../LockedSelector';
import { topBarActionsActionTypes } from '../../TopBarActions';
import { urlArguments } from '../../../utils/url';
import { deriveURLParamsFromHistory } from '../../../utils/routing';

export const navigateBackToMainPageEpic = (action$: InputObservable, store: ReduxStore, { history }) =>
    action$.pipe(
        ofType(searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE),
        switchMap(() => {
            const { currentSelections: { programId, orgUnitId } } = store.value;
            history.push(`/?${urlArguments({ programId, orgUnitId })}`);
            return EMPTY;
        }),
    );

export const openSearchPageLocationChangeEpic = (action$: InputObservable, store: ReduxStore, { history }) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.SEARCH_PAGE_OPEN, topBarActionsActionTypes.SEARCH_PAGE_OPEN),
        switchMap(() => {
            const { programId, orgUnitId } = deriveURLParamsFromHistory(history);
            history.push(`/search?${urlArguments({ programId, orgUnitId })}`);
            return EMPTY;
        }));
