// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { lockedSelectorActionTypes } from '../../LockedSelector/LockedSelector.actions';
import { topBarActionsActionTypes } from '../../TopBarActions/TopBarActions.actions';
import { buildUrlQueryString, deriveURLParamsFromLocation } from '../../../utils/routing';
import { resetLocationChange } from '../../LockedSelector/QuickSelector/actions/QuickSelector.actions';

export const openNewRegistrationPageFromLockedSelectorEpic = (action$: InputObservable, _: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.NEW_REGISTRATION_PAGE_OPEN, topBarActionsActionTypes.NEW_REGISTRATION_PAGE_OPEN),
        map(() => {
            const { orgUnitId, programId } = deriveURLParamsFromLocation();
            history.push(`/new?${buildUrlQueryString({ programId, orgUnitId })}`);
            return resetLocationChange();
        }));
