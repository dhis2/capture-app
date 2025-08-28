import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import type { ApiUtils, EpicAction, ReduxStore } from '../../../../../../../capture-core-utils/types';
import {
    actionTypes as newEventDataEntryActionTypes,
    cancelNewEventNoWorkingListUpdateNeeded,
    cancelNewEventUpdateWorkingList,
    cancelNewEventInitializeWorkingLists,
} from '../actions/dataEntry.actions';

import { isSelectionsEqual } from '../../../../../App/isSelectionsEqual';
import { getLocationQuery, buildUrlQueryString } from '../../../../../../utils/routing';
import { resetLocationChange } from '../../../../../ScopeSelector/QuickSelector/actions/QuickSelector.actions';

export const cancelNewEventEpic = (action$: EpicAction<any>, store: ReduxStore) =>
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

export const cancelNewEventLocationChangeEpic = (action$: EpicAction<any>, store: ReduxStore, { navigate }: ApiUtils) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE),
        map(() => {
            const { programId, orgUnitId } = getLocationQuery();

            navigate(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
            return resetLocationChange();
        }));
