// @flow
import { push } from 'react-router-redux';
import {
    actionTypes as newEventDataEntryActionTypes,
    cancelNewEventNoWorkingListUpdateNeeded,
    cancelNewEventUpdateWorkingList,
} from '../actions/dataEntry.actions';

import isSelectionsEqual from '../../../../App/isSelectionsEqual';

export const cancelNewEventEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE)
        .map(() => {
            const state = store.getState();
            if (!state.offline.online) {
                return cancelNewEventNoWorkingListUpdateNeeded();
            }

            const recentlyAddedEventsCount = Object
                .keys(state.recentlyAddedEvents)
                .length;
            if (recentlyAddedEventsCount > 0) {
                return cancelNewEventUpdateWorkingList();
            }
            const listId = state.workingListSelector.currentWorkingListId;
            const listSelections = listId && state.workingListsContext[listId];
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
            return push(`/programId=${programId}&orgUnitId=${orgUnitId}`);
        });
