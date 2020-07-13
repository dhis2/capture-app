// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
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

    // $FlowFixMe[prop-missing] automated comment
    action$.pipe(
        ofType(selectionActionTypes.SET_ORG_UNIT_ID),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return push(`/${args}`);
        }));

export const setProgram = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(selectionActionTypes.SET_PROGRAM_ID),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return push(`/${args}`);
        }));

export const goBackToListContext = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(selectionActionTypes.GO_BACK_TO_LIST_CONTEXT),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId } = state.currentSelections;
            const args = getArguments(programId, orgUnitId);
            return push(`/${args}`);
        }));
