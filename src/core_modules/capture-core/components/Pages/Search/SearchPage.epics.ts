import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { searchPageActionTypes } from './SearchPage.actions';
import { buildUrlQueryString } from '../../../utils/routing';
import { resetLocationChange } from '../../ScopeSelector/QuickSelector/actions/QuickSelector.actions';
import type { InputObservable, ReduxStore, ApiUtils } from '../../../flow/typeDeclarations';

export const navigateBackToMainPageEpic = (action$: InputObservable, store: ReduxStore, { navigate }: ApiUtils) =>
    action$.pipe(
        ofType(searchPageActionTypes.TO_MAIN_PAGE_NAVIGATE),
        switchMap(() => {
            const { currentSelections: { programId, orgUnitId } } = store.value;
            navigate(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
            return new Promise((resolve) => {
                setTimeout(() => resolve(resetLocationChange()), 0);
            });
        }),
    );
