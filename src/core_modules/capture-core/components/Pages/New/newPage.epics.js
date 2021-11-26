// @flow
import { EMPTY } from 'rxjs';
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { lockedSelectorActionTypes, topBarActionsActionTypes } from '../../LockedSelector/LockedSelector.actions';
import { deriveURLParamsFromHistory, buildUrlQueryString } from '../../../utils/routing';

export const openNewRegistrationPageFromLockedSelectorEpic = (action$: InputObservable, _: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.NEW_REGISTRATION_PAGE_OPEN, topBarActionsActionTypes.NEW_REGISTRATION_PAGE_OPEN),
        switchMap(() => {
            const { orgUnitId, programId } = deriveURLParamsFromHistory(history);
            history.push(`/new?${buildUrlQueryString({ programId, orgUnitId })}`);
            return EMPTY;
        }));
