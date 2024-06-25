// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
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
import { getLocationQuery, buildUrlQueryString } from '../../../../../../utils/routing';
import { resetLocationChange } from '../../../../../ScopeSelector/QuickSelector/actions/QuickSelector.actions';

export const saveNewEventStageEpic = (action$: InputObservable, store: ReduxStore, { history, serverVersion: { minor } }: ApiUtils) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.REQUEST_SAVE_NEW_EVENT_IN_STAGE),
        map((action) => {
            const state = store.value;
            const { dataEntryId, eventId, formFoundation, completed } = action.payload;
            const dataEntryKey = getDataEntryKey(dataEntryId, eventId);

            const { formClientValues, mainDataClientValues }
                = getNewEventClientValues(state, dataEntryKey, formFoundation);
            const serverData =
                getAddEventEnrollmentServerData(
                    state,
                    formFoundation,
                    formClientValues,
                    mainDataClientValues,
                    history,
                    completed,
                    minor,
                );

            const relationshipData = state.dataEntriesRelationships[dataEntryKey];
            return startSaveNewEventAndReturnToList(serverData, relationshipData, state.currentSelections);
        }));

export const saveNewEventInStageLocationChangeEpic = (action$: InputObservable, store: ReduxStore, { history }: ApiUtils) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.REQUEST_SAVE_NEW_EVENT_IN_STAGE),
        map(() => {
            const { enrollmentId, programId, orgUnitId, teiId } = getLocationQuery();
            history.push(`/enrollment?${buildUrlQueryString({ programId, orgUnitId, teiId, enrollmentId })}`);
            return resetLocationChange();
        }));


export const saveNewEventStageFailedEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_IN_STAGE),
        map((action) => {
            const clientId = action.meta.clientId;
            return removeListItem(listId, clientId);
        }));
