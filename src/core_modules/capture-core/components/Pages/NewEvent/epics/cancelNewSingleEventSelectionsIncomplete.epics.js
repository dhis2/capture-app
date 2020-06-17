// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
    actionTypes as dataEntrySelectionsIncompleteActionTypes,
} from '../SelectionsIncomplete/dataEntrySelectionsIncomplete.actions';

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

export const cancelNewEventIncompleteSelectionsLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.pipe(
        ofType(dataEntrySelectionsIncompleteActionTypes.CANCEL_NEW_EVENT_FROM_INCOMPLETE_SELECTIONS_RETURN_TO_MAIN_PAGE),
        map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return push(`/${args}`);
        }));
