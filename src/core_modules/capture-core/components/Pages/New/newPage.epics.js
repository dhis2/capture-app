// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { lockedSelectorActionTypes } from '../../LockedSelector/LockedSelector.actions';
import { topBarActionsActionTypes } from '../../TopBarActions/TopBarActions.actions';
import { deriveUrlQueries } from '../../../utils/url';
import { buildUrlQueryString } from '../../../utils/routing';

export const openNewRegistrationPageFromLockedSelectorEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.NEW_REGISTRATION_PAGE_OPEN, topBarActionsActionTypes.NEW_REGISTRATION_PAGE_OPEN),
        map(() => {
            const { orgUnitId, programId } = deriveUrlQueries(store.value);
            return push(`/new?${buildUrlQueryString({ programId, orgUnitId })}`);
        }));
