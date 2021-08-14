// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
    actionTypes as newEventDataEntryActionTypes,
    startSaveNewEventAfterReturnedToMainPage,
} from '../actions/dataEntry.actions';

import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';
import { getNewEventServerData, getNewEventClientValues } from './getConvertedNewSingleEvent';

export const saveAddEventEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_OVERVIEW_PAGE),
        map((action) => {
            const state = store.value;
            const payload = action.payload;
            const dataEntryKey = getDataEntryKey(payload.dataEntryId, payload.eventId);
            const formFoundation = payload.formFoundation;
            const { formClientValues, mainDataClientValues } = getNewEventClientValues(state, dataEntryKey, formFoundation);

            const serverData = getNewEventServerData(state, formFoundation, formClientValues, mainDataClientValues);
            const relationshipData = state.dataEntriesRelationships[dataEntryKey];
            return startSaveNewEventAfterReturnedToMainPage(serverData, relationshipData, state.currentSelections);
        }));

export const saveAddEventLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_OVERVIEW_PAGE),
        map(() => {
            const state = store.value;
            const { programId, orgUnitId, enrollmentId } = state.router.location.query;
            return push(`/enrollment?programId=${programId}&orgUnitId=${orgUnitId}&enrollmentId=${enrollmentId}`);
        }));
