// @flow
import { push } from 'react-router-redux';
import {
    actionTypes as newEventPageSelectorActionTypes,
    batchActionTypes as newEventPageSelectorBatchActionTypes,
} from './selectorLevel.actions';

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
    action$.ofType(newEventPageSelectorActionTypes.RESET_ORG_UNIT_ID, newEventPageSelectorActionTypes.SET_ORG_UNIT, newEventPageSelectorActionTypes.SET_PROGRAM_ID, newEventPageSelectorActionTypes.RESET_PROGRAM_ID, newEventPageSelectorBatchActionTypes.RESET_PROGRAM_AND_CATEGORY_OPTION)
        .map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return push(`/newEvent/${args}`);
        });

export const newEventPageSelectorResetURLEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newEventPageSelectorBatchActionTypes.START_AGAIN)
        .map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return push(`/${args}`);
        });
