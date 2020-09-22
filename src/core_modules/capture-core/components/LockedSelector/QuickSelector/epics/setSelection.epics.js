// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
    actionTypes as selectionActionTypes,
} from '../actions/QuickSelector.actions';
import { urlArguments } from '../../../../utils/url';

export const setOrgUnit = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(selectionActionTypes.SET_ORG_UNIT_ID),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId } = state.currentSelections;
            return push(`/${urlArguments(programId, orgUnitId)}`);
        }));

export const setProgram = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(selectionActionTypes.SET_PROGRAM_ID),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId } = state.currentSelections;
            return push(`/${urlArguments(programId, orgUnitId)}`);
        }));

export const goBackToListContext = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(selectionActionTypes.GO_BACK_TO_LIST_CONTEXT),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId } = state.currentSelections;
            return push(`/${urlArguments(programId, orgUnitId)}`);
        }));
