// @flow
import { actionTypes as registrationSectionActionTypes } from '../RegistrationSection';
import { openDataEntry, openDataEntryCancelled } from './dataEntry.actions';
import { DATA_ENTRY_ID } from '../registerTei.const';
import {
    openDataEntryForNewEnrollmentBatchAsync,
    openDataEntryForNewTeiBatch,
} from '../../../../DataEntries';
import { getTrackerProgramThrowIfNotFound, TrackerProgram } from '../../../../../metaData';

export const openNewRelationshipRegisterTeiDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(registrationSectionActionTypes.PROGRAM_CHANGE, registrationSectionActionTypes.ORG_UNIT_CHANGE)
        .switchMap((action) => {
            const state = store.getState();
            const { programId, orgUnit } = state.newRelationshipRegisterTei;

            if (programId && orgUnit) {
                let trackerProgram: ?TrackerProgram;
                try {
                    trackerProgram = getTrackerProgramThrowIfNotFound(programId);
                } catch (error) {
                    trackerProgram = null;
                }

                if (!trackerProgram) {
                    return openDataEntryCancelled();
                }

                return openDataEntryForNewEnrollmentBatchAsync(
                    trackerProgram,
                    trackerProgram && trackerProgram.enrollment.enrollmentForm,
                    orgUnit,
                    DATA_ENTRY_ID,
                    [openDataEntry()],
                );
            }

            if (orgUnit) {
                return openDataEntryForNewTeiBatch(
                    DATA_ENTRY_ID,
                    [openDataEntry()],
                );
            }

            return openDataEntryCancelled();
        });
