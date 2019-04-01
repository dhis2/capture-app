// @flow
/* eslint-disable */
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { actionTypes as registrationSectionActionTypes } from '../RegistrationSection';
import { openDataEntry, openDataEntryCancelled } from './dataEntry.actions';
import { DATA_ENTRY_ID } from '../registerTei.const';
import {
    openDataEntryForNewEnrollmentBatchAsync,
    openDataEntryForNewTeiBatch,
} from '../../../../DataEntries';
import {
    getTrackerProgramThrowIfNotFound,
    getTrackedEntityTypeThrowIfNotFound,
    TrackerProgram,
    TrackedEntityType,
} from '../../../../../metaData';

export const openNewRelationshipRegisterTeiDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(registrationSectionActionTypes.PROGRAM_CHANGE, registrationSectionActionTypes.ORG_UNIT_CHANGE)
        .switchMap((action) => {
            const state = store.getState();
            const { programId, orgUnit } = state.newRelationshipRegisterTei;
            const TETTypeId = state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;

            if (programId && orgUnit) {
                let trackerProgram: ?TrackerProgram;
                try {
                    trackerProgram = getTrackerProgramThrowIfNotFound(programId);
                } catch (error) {
                    log.error(
                        errorCreator('tracker program for id not found')({ programId }),
                    );
                    return openDataEntryCancelled();
                }
                
                return openDataEntryForNewEnrollmentBatchAsync(
                    trackerProgram,
                    trackerProgram && trackerProgram.enrollment.enrollmentForm,
                    orgUnit,
                    DATA_ENTRY_ID,
                    [openDataEntry()],
                    [],
                    state.generatedUniqueValuesCache[DATA_ENTRY_ID],
                );
            }

            if (orgUnit) {
                let TETType;
                try {
                    TETType = getTrackedEntityTypeThrowIfNotFound(TETTypeId);    
                } catch (error) {
                    log.error(
                        errorCreator('TET for id not found')({ TETTypeId }),
                    );
                    return openDataEntryCancelled();
                }
                
                return openDataEntryForNewTeiBatch(
                    TETType.teiRegistration.form,
                    orgUnit,
                    DATA_ENTRY_ID,
                    [openDataEntry()],
                    state.generatedUniqueValuesCache[DATA_ENTRY_ID],
                );
            }

            return openDataEntryCancelled();
        });
