// @flow
import { ofType } from 'redux-observable';
import { pluck, switchMap } from 'rxjs/operators';
import { empty, from } from 'rxjs';
import { errorCreator } from 'capture-core-utils';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { enrollmentRegistrationEntryActionTypes } from './EnrollmentRegistrationEntry.actions';
import { openDataEntryForNewEnrollmentBatchAsync } from '../Enrollment';
import { getTrackerProgramThrowIfNotFound } from '../../../metaData/helpers';
import { openDataEntryFailed } from '../../Pages/NewRelationship/RegisterTei/DataEntry/RegisterTeiDataEntry.actions';
import { type TrackerProgram } from '../../../metaData/Program';

export const startNewEnrollmentDataEntrySelfInitialisationEpic = (action$: InputObservable) =>
    action$.pipe(
        ofType(enrollmentRegistrationEntryActionTypes.TRACKER_PROGRAM_REGISTRATION_ENTRY_INITIALISATION_START),
        pluck('payload'),
        switchMap(({ selectedOrgUnitId, selectedScopeId: programId, dataEntryId, formFoundation }) => {
            if (selectedOrgUnitId) {
                let trackerProgram: ?TrackerProgram;
                try {
                    trackerProgram = getTrackerProgramThrowIfNotFound(programId);
                } catch (error) {
                    log.error(
                        errorCreator('tracker program for id not found')({ programId, error }),
                    );
                    return Promise.resolve(openDataEntryFailed(i18n.t('Metadata error. see log for details')));
                }

                const openEnrollmentPromise = openDataEntryForNewEnrollmentBatchAsync(
                    trackerProgram,
                    formFoundation,
                    { id: selectedOrgUnitId },
                    dataEntryId,
                );

                return from(openEnrollmentPromise);
            }

            return empty();
        }),
    );
