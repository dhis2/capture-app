// @flow
import { map } from 'rxjs/operators';
import { push } from 'connected-react-router';
import { searchPageActionTypes } from './SearchPage.container';
import { urlArguments } from '../../../utils/url';

export const navigateBackToMainPageEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE).pipe(
        map(() => {
            const { currentSelections: { programId, orgUnitId } } = store.getState();
            return push(`/${urlArguments(programId, orgUnitId)}`);
        }),
    );
