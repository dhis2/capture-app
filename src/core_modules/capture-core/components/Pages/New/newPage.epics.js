// @flow
import { EMPTY } from 'rxjs';
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { lockedSelectorActionTypes } from '../../LockedSelector/LockedSelector.actions';
import { topBarActionsActionTypes } from '../../TopBarActions/TopBarActions.actions';
import { urlArguments } from '../../../utils/url';
import { deriveURLParamsFromHistory } from '../../../utils/routing';

export const openNewRegistrationPageFromLockedSelectorEpic = (action$: InputObservable, _: ReduxStore, { history }) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.NEW_REGISTRATION_PAGE_OPEN, topBarActionsActionTypes.NEW_REGISTRATION_PAGE_OPEN),
        switchMap(() => {
            const { orgUnitId, programId } = deriveURLParamsFromHistory(history);
            history.push(`/new?${urlArguments({ programId, orgUnitId })}`);
            return EMPTY;
        }));
