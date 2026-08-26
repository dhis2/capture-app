import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import type { EpicAction, ReduxStore, ApiUtils } from 'capture-core-utils/types';
import { searchPageActionTypes } from './SearchPage.actions';
import { buildUrlQueryString } from '../../../utils/routing';
import { resetLocationChange } from '../../ScopeSelector/QuickSelector/actions/QuickSelector.actions';

export const navigateBackToMainPageEpic = (action$: EpicAction<any>, store: ReduxStore, { navigate }: ApiUtils) =>
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
