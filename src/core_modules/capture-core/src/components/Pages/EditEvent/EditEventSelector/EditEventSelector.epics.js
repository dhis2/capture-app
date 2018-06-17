// @flow
import { replace } from 'react-router-redux';
import {
    actionTypes as editEventPageSelectorActionTypes,
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
    action$.ofType(editEventPageSelectorActionTypes.RESET_ORG_UNIT_ID, editEventPageSelectorActionTypes.SET_ORG_UNIT, editEventPageSelectorActionTypes.SET_PROGRAM_ID, editEventPageSelectorActionTypes.RESET_PROGRAM_ID)
        .map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return replace(`/${args}`);
        });
