import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { searchPageActionTypes } from './SearchPage.actions';
import { buildUrlQueryString } from '../../../utils/routing';
import { resetLocationChange } from '../../ScopeSelector/QuickSelector/actions/QuickSelector.actions';

export const navigateBackToMainPageEpic = (action$: any, store: any, { navigate }: any) =>
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
