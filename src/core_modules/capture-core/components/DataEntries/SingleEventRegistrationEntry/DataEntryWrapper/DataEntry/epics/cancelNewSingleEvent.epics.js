// @flow
import { EMPTY } from 'rxjs';
import { ofType } from 'redux-observable';
import { map, switchMap } from 'rxjs/operators';
import {
    actionTypes as newEventDataEntryActionTypes,
    cancelNewEventNoWorkingListUpdateNeeded,
    cancelNewEventUpdateWorkingList,
    cancelNewEventInitializeWorkingLists,
} from '../actions/dataEntry.actions';

import { isSelectionsEqual } from '../../../../../App/isSelectionsEqual';
import { deriveURLParamsFromHistory } from '../../../../../../utils/routing';
import { urlArguments } from '../../../../../../utils/url';

export const cancelNewEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE),
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

export const cancelNewEventLocationChangeEpic = (action$: InputObservable, store: ReduxStore, { history }) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE),
        switchMap(() => {
            const { pathname } = history.location;
            const { enrollmentId, programId, orgUnitId } = deriveURLParamsFromHistory(history);

            if (pathname === '/enrollmentEventNew') {
                history.push(`/enrollment${urlArguments({ enrollmentId })}`);
                return EMPTY;
            }
            history.push(`/?${urlArguments({ programId, orgUnitId })}`);
            return EMPTY;
        }));
