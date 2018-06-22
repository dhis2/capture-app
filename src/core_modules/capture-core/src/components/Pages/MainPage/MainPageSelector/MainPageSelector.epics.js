// @flow
import { replace } from 'react-router-redux';
import {
    actionTypes as mainPageSelectorActionTypes,
    batchActionTypes as mainPageSelectorBatchActionTypes,
} from './MainPageSelector.actions';

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

export const mainPageSelectorUpdateURLEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(mainPageSelectorActionTypes.RESET_ORG_UNIT_ID, mainPageSelectorActionTypes.SET_ORG_UNIT,
        mainPageSelectorActionTypes.SET_PROGRAM_ID, mainPageSelectorActionTypes.RESET_PROGRAM_ID,
        mainPageSelectorBatchActionTypes.START_AGAIN, mainPageSelectorBatchActionTypes.RESET_PROGRAM_AND_CATEGORY_OPTION)
        .map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return replace(`/${args}`);
        });
