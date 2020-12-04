// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { lockedSelectorActionTypes } from '../../LockedSelector/LockedSelector.actions';
import { urlArguments } from '../../../utils/url';

export const openNewRegistrationPageWithoutProgramIdEpic: Epic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.NEW_REGISTRATION_PAGE_WITHOUT_PROGRAM_ID_OPEN),
        map(() => {
            const state = store.value;
            const { orgUnitId } = state.currentSelections;
            return push(`/new/${urlArguments({ orgUnitId })}`);
        }),
    );
