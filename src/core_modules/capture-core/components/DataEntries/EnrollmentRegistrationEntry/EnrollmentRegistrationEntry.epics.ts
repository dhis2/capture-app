import { ofType } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import { errorCreator } from 'capture-core-utils';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { enrollmentRegistrationEntryActionTypes } from './EnrollmentRegistrationEntry.actions';
import { openDataEntryForNewEnrollmentBatch } from '../Enrollment';
import { getTrackerProgramThrowIfNotFound } from '../../../metaData/helpers';
import { openDataEntryFailed } from '../../Pages/NewRelationship/RegisterTei/DataEntry/RegisterTeiDataEntry.actions';
import type { TrackerProgram } from '../../../metaData/Program';

export const startNewEnrollmentDataEntrySelfInitialisationEpic = (action$: any) =>
    action$.pipe(
        ofType(enrollmentRegistrationEntryActionTypes.TRACKER_PROGRAM_REGISTRATION_ENTRY_INITIALISATION_START),
        map(({ payload }) => payload),
        filter(({ selectedOrgUnit }: any) => selectedOrgUnit),
        map(({
            selectedOrgUnit,
            selectedScopeId: programId,
            dataEntryId,
            formValues,
            clientValues,
            programCategory,
            firstStage,
            formFoundation,
        }: any) => {
            let trackerProgram: TrackerProgram | null = null;
            try {
                trackerProgram = getTrackerProgramThrowIfNotFound(programId);
            } catch (error) {
                log.error(
                    errorCreator('tracker program for id not found')({ programId, error }),
                );
            }

            if (!trackerProgram) {
                return openDataEntryFailed(i18n.t('Metadata error. see log for details'));
            }

            return openDataEntryForNewEnrollmentBatch({
                program: trackerProgram,
                orgUnit: selectedOrgUnit,
                dataEntryId,
                formValues,
                clientValues,
                firstStage,
                programCategory,
                formFoundation,
            });
        }),
    );
