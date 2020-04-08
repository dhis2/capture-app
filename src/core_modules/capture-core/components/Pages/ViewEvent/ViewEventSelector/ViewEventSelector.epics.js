// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
    actionTypes as viewEventPageSelectorActionTypes,
    batchActionTypes as viewEventPageSelectorBatchActionTypes,
} from './ViewEventSelector.actions';

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

export const viewEventPageSelectorUpdateURLEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.pipe(
        ofType(viewEventPageSelectorActionTypes.RESET_ORG_UNIT_ID,
            viewEventPageSelectorActionTypes.SET_ORG_UNIT, viewEventPageSelectorActionTypes.SET_PROGRAM_ID,
            viewEventPageSelectorActionTypes.RESET_PROGRAM_ID, viewEventPageSelectorActionTypes.RESET_CATEGORY_OPTION,
            viewEventPageSelectorBatchActionTypes.START_AGAIN, viewEventPageSelectorBatchActionTypes.RESET_PROGRAM_AND_CATEGORY_OPTION),
        map(() => {
            const state = store.getState();
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return push(`/${args}`);
        }));
