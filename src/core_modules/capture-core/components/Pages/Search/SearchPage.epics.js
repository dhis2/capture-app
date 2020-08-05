// @flow
import { map } from 'rxjs/operators';
import { push } from 'connected-react-router';
import { searchPageActionTypes } from './SearchPage.actions';
import { lockedSelectorActionTypes } from '../../LockedSelector';

const url = (programId: string, orgUnitId: string) => {
    const argArray = [];
    if (programId) {
        argArray.push(`programId=${programId}`);
    }
    if (orgUnitId) {
        argArray.push(`orgUnitId=${orgUnitId}`);
    }

    return `/${argArray.join('&')}`;
};

export const navigateBackToMainPageEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE).pipe(
        map(() => {
            const { currentSelections: { programId, orgUnitId } } = store.getState();
            return push(url(programId, orgUnitId));
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
