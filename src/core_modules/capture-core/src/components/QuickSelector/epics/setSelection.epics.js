// @flow
import { replace } from 'react-router-redux';
import {
    actionTypes as selectionActionTypes,
} from '../actions/QuickSelector.actions';

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

export const setOrgUnit = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(selectionActionTypes.SET_ORG_UNIT_ID)
        .map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return replace(`/${args}`);
        });

export const setProgram = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(selectionActionTypes.SET_PROGRAM_ID)
        .map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return replace(`/${args}`);
        });
