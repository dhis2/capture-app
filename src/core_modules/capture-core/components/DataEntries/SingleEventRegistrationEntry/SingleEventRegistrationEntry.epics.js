// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { lockedSelectorActionTypes } from '../../LockedSelector/LockedSelector.actions';
import { urlArguments } from '../../../utils/url';

export const openNewEventPageLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.NEW_EVENT_PAGE_OPEN),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId } = state.currentSelections;
            return push(`/newEvent/${urlArguments({ programId, orgUnitId })}`);
        }));
