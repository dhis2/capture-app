// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
    actionTypes as dataEntrySelectionsIncompleteActionTypes,
} from '../SelectionsIncomplete/dataEntrySelectionsIncomplete.actions';
import { urlArguments } from '../../../../utils/url';

export const cancelNewEventIncompleteSelectionsLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(dataEntrySelectionsIncompleteActionTypes.CANCEL_NEW_EVENT_FROM_INCOMPLETE_SELECTIONS_RETURN_TO_MAIN_PAGE),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId } = state.currentSelections;
            return push(`/${urlArguments(programId, orgUnitId)}`);
        }));
