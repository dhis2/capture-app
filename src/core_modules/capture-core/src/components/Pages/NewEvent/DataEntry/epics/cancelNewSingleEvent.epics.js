// @flow
import { replace } from 'react-router-redux';
import {
    actionTypes as newEventDataEntryActionTypes,
    cancelNewEventNoWorkingListUpdateNeeded,
    cancelNewEventUpdateWorkingList,
} from '../newEventDataEntry.actions';
import isSelectionsEqual from '../../../../App/isSelectionsEqual';

export const cancelNewEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE)
        .map(() => {
            const state = store.getState();
            const listSelections = state.workingListsContext.main;
            if (!listSelections) {
                return cancelNewEventUpdateWorkingList();
            }
            const currentSelections = state.currentSelections;
            if (currentSelections.complete && !isSelectionsEqual(listSelections, currentSelections)) {
                return cancelNewEventUpdateWorkingList();
            }
            return cancelNewEventNoWorkingListUpdateNeeded();
        });

export const cancelNewEventLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE)
        .map(() => {
            const state = store.getState();
            const programId = state.currentSelections.programId;
            const orgUnitId = state.currentSelections.orgUnitId;
            return replace(`/programId=${programId}&orgUnitId=${orgUnitId}`);
        });
