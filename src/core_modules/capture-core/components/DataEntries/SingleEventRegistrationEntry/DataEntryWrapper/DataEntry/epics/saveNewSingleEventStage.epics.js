// @flow
import { ofType } from 'redux-observable';
import { map, switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import {
    actionTypes as newEventDataEntryActionTypes,
    startSaveNewEventAndReturnToList,
} from '../actions/dataEntry.actions';

import {
    removeListItem,
} from '../../RecentlyAddedEventsList';

import { getDataEntryKey } from '../../../../../DataEntry/common/getDataEntryKey';
import { getAddEventEnrollmentServerData, getNewEventClientValues } from './getConvertedNewSingleEvent';
import { listId } from '../../RecentlyAddedEventsList/RecentlyAddedEventsList.const';
import { deriveURLParamsFromHistory } from '../../../../../../utils/routing';
import { urlArguments } from '../../../../../../utils/url';

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

export const saveNewEventInStageLocationChangeEpic = (action$: InputObservable, store: ReduxStore, { history }) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.REQUEST_SAVE_NEW_EVENT_IN_STAGE),
        switchMap(() => {
            const { enrollmentId, programId, orgUnitId, teiId } = deriveURLParamsFromHistory(history);
            history.push(`/enrollment?${urlArguments({ programId, orgUnitId, teiId, enrollmentId })}`);
            return EMPTY;
        }));


export const saveNewEventStageFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_IN_STAGE),
        map((action) => {
            const clientId = action.meta.clientId;
            return removeListItem(listId, clientId);
        }));
