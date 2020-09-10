// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { push } from 'connected-react-router';
import { searchPageActionTypes } from './SearchPage.actions';

export const navigateBackToMainPageEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE),
        map(() => {
            const { currentSelections: { programId, orgUnitId } } = store.value;
            return push(`/${urlArguments(programId, orgUnitId)}`);
        }),
    );
