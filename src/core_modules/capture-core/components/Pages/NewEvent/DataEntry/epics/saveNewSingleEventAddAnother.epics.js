// @flow
import { batchActions } from 'redux-batched-actions';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import uuid from 'd2-utilizr/lib/uuid';
import moment from 'capture-core-utils/moment/momentResolver';
import {
  actionTypes as newEventDataEntryActionTypes,
  batchActionTypes as newEventDataEntryBatchActionTypes,
  startSaveNewEventAddAnother,
} from '../actions/dataEntry.actions';

import { newRecentlyAddedEvent } from '../../RecentlyAddedEventsList/recentlyAddedEventsList.actions';

import { prependListItem, removeListItem } from '../../../../List/list.actions';

import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { getNewEventServerData, getNewEventClientValues } from './getConvertedNewSingleEvent';
import { listId } from '../../RecentlyAddedEventsList/RecentlyAddedEventsList.const';

export const saveNewEventAddAnotherEpic = (action$: InputObservable, store: ReduxStore) =>
  action$.pipe(
    ofType(newEventDataEntryActionTypes.REQUEST_SAVE_NEW_EVENT_ADD_ANOTHER),
    map((action) => {
      const state = store.value;
      const { payload } = action;
      const { formFoundation } = payload;
      const dataEntryKey = getDataEntryKey(payload.dataEntryId, payload.eventId);

      const { formClientValues, mainDataClientValues } = getNewEventClientValues(
        state,
        dataEntryKey,
        formFoundation,
      );

      const serverData = getNewEventServerData(
        state,
        formFoundation,
        formClientValues,
        mainDataClientValues,
      );
      const clientEvent = {
        ...mainDataClientValues,
        eventId: uuid(),
        programId: state.currentSelections.programId,
        programStageId: formFoundation.id,
        orgUnitId: state.currentSelections.orgUnitId,
      };
      const clientEventValues = { ...formClientValues, created: moment().toISOString() };
      const relationshipData = state.dataEntriesRelationships[dataEntryKey];
      return batchActions(
        [
          startSaveNewEventAddAnother(
            serverData,
            relationshipData,
            state.currentSelections,
            clientEvent.eventId,
          ),
          newRecentlyAddedEvent(clientEvent, clientEventValues),
          prependListItem(listId, clientEvent.eventId),
        ],
        newEventDataEntryBatchActionTypes.SAVE_NEW_EVENT_ADD_ANOTHER_BATCH,
      );
    }),
  );

export const saveNewEventAddAnotherFailedEpic = (action$: InputObservable) =>
  action$.pipe(
    ofType(newEventDataEntryActionTypes.SAVE_FAILED_FOR_NEW_EVENT_ADD_ANOTHER),
    map((action) => {
      const { clientId } = action.meta;
      return removeListItem(listId, clientId);
    }),
  );
