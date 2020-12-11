// @flow
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';
import { getTrackerProgramThrowIfNotFound } from '../../../../../metaData/helpers';
import {
  actionTypes,
  startSaveNewEnrollmentAfterReturnedToMainPage,
} from '../actions/dataEntry.actions';
import getDataEntryKey from '../../../../DataEntry/common/getDataEntryKey';
import { buildServerDataForEnrollmentDataEntry } from '../../../../DataEntries';

export const saveNewEnrollmentEpic = (action$: InputObservable, store: ReduxStore) =>
  action$.pipe(
    ofType(actionTypes.REQUEST_SAVE_RETURN_TO_MAIN_PAGE),
    map((action) => {
      const state = store.value;
      const { payload } = action;
      const dataEntryKey = getDataEntryKey(payload.dataEntryId, payload.itemId);
      const { programId } = state.currentSelections;
      const selections = {
        programId,
        orgUnitId: state.currentSelections.orgUnitId,
      };

      const trackerProgram = getTrackerProgramThrowIfNotFound(programId);
      const serverData = buildServerDataForEnrollmentDataEntry(
        dataEntryKey,
        selections,
        trackerProgram.enrollment,
        state.formsValues[dataEntryKey],
      );
      return startSaveNewEnrollmentAfterReturnedToMainPage(serverData, state.currentSelections);
    }),
  );
