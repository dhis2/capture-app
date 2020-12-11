// @flow
import log from 'loglevel';
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';
import { errorCreator } from 'capture-core-utils';
import { actionTypes as urlActionTypes } from '../../actions/url.actions';
import {
  openDataEntryForNewEnrollment,
  selectionsNotCompleteOpeningNewEnrollment,
} from '../actions/openDataEntry.actions';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../../../metaData';
import { openDataEntryForNewEnrollmentBatchAsync } from '../../../../DataEntries';

const errorMessages = {
  PROGRAM_NOT_FOUND: 'Program not found',
  NOT_TRACKER_PROGRAM: 'Program is not a tracker program',
};

export const openNewEnrollmentInDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
  action$.pipe(
    ofType(urlActionTypes.VALID_SELECTIONS_FROM_URL),
    switchMap(() => {
      const state = store.value;
      const selectionsComplete = state.currentSelections.complete;
      if (!selectionsComplete) {
        return selectionsNotCompleteOpeningNewEnrollment();
      }

      const { programId } = state.currentSelections;
      const { orgUnitId } = state.currentSelections;
      const orgUnit = state.organisationUnits[orgUnitId];
      let trackerProgram: TrackerProgram;
      try {
        const program = getProgramFromProgramIdThrowIfNotFound(programId);
        if (!(program instanceof TrackerProgram)) {
          log.error(
            errorCreator(errorMessages.NOT_TRACKER_PROGRAM)({
              method: 'openNewEnrollmentInDataEntryEpic',
              program,
            }),
          );
        } else {
          trackerProgram = program;
        }
      } catch (error) {
        log.error(
          errorCreator(errorMessages.PROGRAM_NOT_FOUND)({
            method: 'openNewEnrollmentInDataEntryEpic',
            error,
            programId,
          }),
        );
      }

      const foundation = trackerProgram && trackerProgram.enrollment.enrollmentForm;
      const dataEntryId = 'enrollment';
      return openDataEntryForNewEnrollmentBatchAsync(
        trackerProgram,
        foundation,
        orgUnit,
        dataEntryId,
        [openDataEntryForNewEnrollment()],
        [],
        state.generatedUniqueValuesCache[dataEntryId],
      );
    }),
  );
