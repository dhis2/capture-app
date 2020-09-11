// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { push } from 'connected-react-router';
import { searchPageActionTypes } from './SearchPage.actions';
import { urlArguments } from '../../../utils/url';

export const navigateBackToMainPageEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE),
        map(() => {
            const { currentSelections: { programId, orgUnitId } } = store.value;
            return push(`/${urlArguments(programId, orgUnitId)}`);
        }),
    );

export const openSearchPageLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(lockedSelectorActionTypes.SEARCH_PAGE_OPEN)
        .map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const args = url(programId, orgUnitId);
            return push(`/search${args}`);
        });
