// @flow
import { replace } from 'react-router-redux';
import {
    actionTypes as editEventDataEntryActionTypes,
    noWorkingListUpdateNeededAfterUpdateCancelled,
    updateWorkingListAfterUpdateCancelled,
} from '../editEventDataEntry.actions';

export const cancelEditEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(editEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE)
        .map(() => {
            const state = store.getState();
            const workingListHasBeenLoaded = state.workingListsUI.main && state.workingListsUI.main.hasBeenLoaded;
            if (!workingListHasBeenLoaded) {
                return updateWorkingListAfterUpdateCancelled();
            }
            return noWorkingListUpdateNeededAfterUpdateCancelled();
        });

export const cancelEditEventLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(editEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE)
        .map(() => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const orgUnitId = state.currentSelections.orgUnitId;
            return replace(`/programId=${programId}&orgUnitId=${orgUnitId}`);
        });
