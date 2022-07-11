// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
    actionTypes as editEventDataEntryActionTypes,
    noWorkingListUpdateNeededAfterUpdateCancelled,
    updateWorkingListAfterUpdateCancelled,
} from '../editEventDataEntry.actions';

import { isSelectionsEqual } from '../../../App/isSelectionsEqual';
import { deriveURLParamsFromLocation, buildUrlQueryString } from '../../../../utils/routing';
import { resetLocationChange } from '../../../ScopeSelector/QuickSelector/actions/QuickSelector.actions';

export const cancelEditEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(editEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE),
        map(() => {
            const state = store.value;

            if (!state.offline.online) {
                return noWorkingListUpdateNeededAfterUpdateCancelled();
            }
            const listId = state.workingListsTemplates.eventList.currentListId;
            const listSelections = listId && state.workingListsContext[listId];
            if (!listSelections) {
                return updateWorkingListAfterUpdateCancelled();
            }
            const currentSelections = state.currentSelections;
            if (currentSelections.complete && !isSelectionsEqual(listSelections, currentSelections)) {
                return updateWorkingListAfterUpdateCancelled();
            }
            return noWorkingListUpdateNeededAfterUpdateCancelled();
        }));

export const cancelEditEventLocationChangeEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(editEventDataEntryActionTypes.START_CANCEL_SAVE_RETURN_TO_MAIN_PAGE),
        map(() => {
            const { programId, orgUnitId } = deriveURLParamsFromLocation();
            history.push(`/?${buildUrlQueryString({ programId, orgUnitId })}`);
            return resetLocationChange();
        }));
