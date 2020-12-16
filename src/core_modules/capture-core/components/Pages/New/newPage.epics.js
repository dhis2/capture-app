// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { lockedSelectorActionTypes } from '../../LockedSelector/LockedSelector.actions';
import { urlArguments } from '../../../utils/url';

export const openNewRegistrationPageFromLockedSelectorEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.NEW_REGISTRATION_PAGE_OPEN),
        map(() => {
            const { orgUnitId, programId } = store.value.currentSelections;
            return push(`/new/${urlArguments({ programId, orgUnitId })}`);
        }));
