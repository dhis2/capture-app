// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
    actionTypes as editEventPageSelectorActionTypes,
    batchActionTypes as editEventPageSelectorBatchActionTypes,
} from './EditEventSelector.actions';

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

export const editEventPageSelectorUpdateURLEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.pipe(
        ofType(editEventPageSelectorActionTypes.RESET_ORG_UNIT_ID,
            editEventPageSelectorActionTypes.SET_ORG_UNIT, editEventPageSelectorActionTypes.SET_PROGRAM_ID,
            editEventPageSelectorActionTypes.RESET_PROGRAM_ID, editEventPageSelectorActionTypes.RESET_CATEGORY_OPTION,
            editEventPageSelectorBatchActionTypes.START_AGAIN, editEventPageSelectorBatchActionTypes.RESET_PROGRAM_AND_CATEGORY_OPTION),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return push(`/${args}`);
        }));
