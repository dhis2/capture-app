// @flow
import { map } from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { push } from 'connected-react-router';
import {
    actionTypes as newEventDataEntryActionTypes,
    startSaveNewEventAndReturnToList,
} from '../actions/dataEntry.actions';
import { listId } from '../../RecentlyAddedEventsList/RecentlyAddedEventsList.const';
import {
    removeListItem,
} from '../../RecentlyAddedEventsList';
import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';


import { getAddEventEnrollmentServerData, getNewEventClientValues } from './getConvertedNewSingleEvent';

export const saveNewEventStageEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.REQUEST_SAVE_NEW_EVENT_IN_STAGE),
        map((action) => {
            const state = store.value;
            const { dataEntryId, eventId, formFoundation, completed } = action.payload;
            const dataEntryKey = getDataEntryKey(dataEntryId, eventId);

            const { formClientValues, mainDataClientValues }
                = getNewEventClientValues(state, dataEntryKey, formFoundation);
            const serverData =
                getAddEventEnrollmentServerData(state, formFoundation, formClientValues, mainDataClientValues, completed);

            const relationshipData = state.dataEntriesRelationships[dataEntryKey];
            return startSaveNewEventAndReturnToList(serverData, relationshipData, state.currentSelections);
        }));

export const saveNewEventInStageLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.REQUEST_SAVE_NEW_EVENT_IN_STAGE),
        map(() => {
            const state = store.value;
            const { enrollmentId, programId, orgUnitId, teiId } = state.router.location.query;

            return push(`/enrollment?programId=${programId}&orgUnitId=${orgUnitId}&teiId=${teiId}&enrollmentId=${enrollmentId}`);
        }));


export const saveNewEventStageFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_IN_STAGE),
        map((action) => {
            const clientId = action.meta.clientId;
            return removeListItem(listId, clientId);
        }));
