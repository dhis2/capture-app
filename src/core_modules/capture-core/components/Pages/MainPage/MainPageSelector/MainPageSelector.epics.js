// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { push } from 'connected-react-router';
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
    action$.pipe(
        ofType(mainPageSelectorActionTypes.RESET_ORG_UNIT_ID, mainPageSelectorActionTypes.SET_ORG_UNIT,
            mainPageSelectorActionTypes.SET_PROGRAM_ID, mainPageSelectorActionTypes.RESET_PROGRAM_ID,
            mainPageSelectorBatchActionTypes.START_AGAIN, mainPageSelectorBatchActionTypes.RESET_PROGRAM_AND_CATEGORY_OPTION),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return push(`/${args}`);
        }));
