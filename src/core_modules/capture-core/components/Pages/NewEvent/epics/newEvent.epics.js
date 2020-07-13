// @flow
import { push } from 'connected-react-router';
import { lockedSelectorActionTypes } from '../../../LockedSelector/LockedSelector.actions';

const getArguments = (programId: string, orgUnitId: string) => {
    const argArray = [];
    if (programId) {
        argArray.push(`programId=${programId}`);
    }
    if (orgUnitId) {
        argArray.push(`orgUnitId=${orgUnitId}`);
    }

    return argArray.join('&');
};

export const openNewEventPageLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(lockedSelectorActionTypes.NEW_EVENT_OPEN),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return push(`/newEvent/${args}`);
        }));
