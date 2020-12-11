// @flow
import { push } from 'connected-react-router';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import {
  actionTypes as newEventDataEntryActionTypes,
  startSaveNewEventAfterReturnedToMainPage,
} from '../actions/dataEntry.actions';

import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { getNewEventServerData, getNewEventClientValues } from './getConvertedNewSingleEvent';

export const saveNewEventEpic = (action$: InputObservable, store: ReduxStore) =>
  action$.pipe(
    ofType(newEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE),
    map((action) => {
      const state = store.value;
      const { payload } = action;
      const dataEntryKey = getDataEntryKey(payload.dataEntryId, payload.eventId);
      const { formFoundation } = payload;
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
      const relationshipData = state.dataEntriesRelationships[dataEntryKey];
      return startSaveNewEventAfterReturnedToMainPage(
        serverData,
        relationshipData,
        state.currentSelections,
      );
    }),
  );

export const saveNewEventLocationChangeEpic = (action$: InputObservable, store: ReduxStore) =>
  action$.pipe(
    ofType(newEventDataEntryActionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE),
    map(() => {
      const state = store.value;
      const { programId } = state.currentSelections;
      const { orgUnitId } = state.currentSelections;
      return push(`/programId=${programId}&orgUnitId=${orgUnitId}`);
    }),
  );
