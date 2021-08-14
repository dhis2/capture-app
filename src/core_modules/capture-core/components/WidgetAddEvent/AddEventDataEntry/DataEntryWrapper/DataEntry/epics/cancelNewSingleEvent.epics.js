// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
    actionTypes as newEventDataEntryActionTypes,
    cancelNewEventNoWorkingListUpdateNeeded,
    cancelNewEventUpdateWorkingList,
    cancelNewEventInitializeWorkingLists,
} from '../actions/dataEntry.actions';

import { isSelectionsEqual } from '../../../../../App/isSelectionsEqual';

export const cancelAddEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_OVERVIEW_PAGE),
        map(() => {
            const state = store.value;
            if (!state.offline.online) {
                return cancelNewEventNoWorkingListUpdateNeeded();
            }

            const listId = state.workingListsTemplates.eventList && state.workingListsTemplates.eventList.currentListId;
            const listSelections = listId && state.workingListsContext[listId];
            if (!listSelections) {
                return cancelNewEventInitializeWorkingLists();
            }
            const currentSelections = state.currentSelections;
            if (currentSelections.complete && !isSelectionsEqual(listSelections, currentSelections)) {
                return cancelNewEventInitializeWorkingLists();
            }

            const recentlyAddedEventsCount = Object
                .keys(state.recentlyAddedEvents)
                .length;
            if (recentlyAddedEventsCount > 0) {
                return cancelNewEventUpdateWorkingList();
            }
            return cancelNewEventNoWorkingListUpdateNeeded();
        }));

export const cancelAddEventLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_OVERVIEW_PAGE),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId, enrollmentId } = state.router.location.query;
            return push(`/enrollment?enrollment=${programId}&orgUnitId=${orgUnitId}&enrollmentId=${enrollmentId}`);
        }));
