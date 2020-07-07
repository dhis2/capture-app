// @flow
import { map } from 'rxjs/operators';
import { push } from 'connected-react-router';
import { searchPageActionTypes } from './SearchPage.container';

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
