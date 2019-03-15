// @flow
import { push } from 'react-router-redux';
import {
    actionTypes as dataEntrySelectionsIncompleteActionTypes,
} from '../SelectionsIncomplete/dataEntrySelectionsIncomplete.actions';

import {
    actionTypes as dataEntrySelectionsNoAccessActionTypes,
} from '../SelectionsNoAccess/dataEntrySelectionsNoAccess.actions';

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

export const cancelNewEventSelectionsWithErrorLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(
        dataEntrySelectionsIncompleteActionTypes.CANCEL_NEW_EVENT_FROM_INCOMPLETE_SELECTIONS_RETURN_TO_MAIN_PAGE,
        dataEntrySelectionsNoAccessActionTypes.CANCEL_NEW_EVENT_FROM_SELECTIONS_NO_ACCESS_RETURN_TO_MAIN_PAGE,
    )
        .map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return push(`/${args}`);
        });
