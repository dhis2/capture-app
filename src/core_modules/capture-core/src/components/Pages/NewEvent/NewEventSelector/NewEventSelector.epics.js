// @flow
import { replace } from 'react-router-redux';
import {
    actionTypes as newEventPageSelectorActionTypes,
} from './NewEventSelector.actions';

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

export const newEventPageSelectorUpdateURLEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newEventPageSelectorActionTypes.RESET_ORG_UNIT_ID, newEventPageSelectorActionTypes.SET_ORG_UNIT, newEventPageSelectorActionTypes.SET_PROGRAM_ID, newEventPageSelectorActionTypes.RESET_PROGRAM_ID)
        .map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return replace(`/newEvent/${args}`);
        });
