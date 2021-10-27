// @flow
import { ofType } from 'redux-observable';
import { map, switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import {
    actionTypes as editEventDataEntryActionTypes,
    noWorkingListUpdateNeededAfterUpdateCancelled,
    updateWorkingListAfterUpdateCancelled,
} from '../editEventDataEntry.actions';

import { isSelectionsEqual } from '../../../App/isSelectionsEqual';
import { deriveURLParamsFromHistory } from '../../../../utils/routing';
import { urlArguments } from '../../../../utils/url';

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
        switchMap(() => {
            const { programId, orgUnitId } = deriveURLParamsFromHistory(history);
            history.push(`/?${urlArguments({ programId, orgUnitId })}`);
            return EMPTY;
        }));
