// @flow
import { from } from 'rxjs';
import { ofType } from 'redux-observable';
import { takeUntil, switchMap } from 'rxjs/operators';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import { actionTypes as registrationSectionActionTypes } from '../RegistrationSection';
import { openDataEntry, openDataEntryCancelled, openDataEntryFailed } from './dataEntry.actions';
import { actionTypes as newRelationshipActionTypes } from '../../newRelationship.actions';
import { DATA_ENTRY_ID } from '../registerTei.const';
import {
    openDataEntryForNewEnrollmentBatchAsync,
    openDataEntryForNewTeiBatchAsync,
} from '../../../../DataEntries';
import {
    getTrackerProgramThrowIfNotFound,
    getTrackedEntityTypeThrowIfNotFound,
    TrackerProgram,
    TrackedEntityType,
} from '../../../../../metaData';

export const openNewRelationshipRegisterTeiDataEntryEpic = (action$: InputObservable, store: ReduxStore) =>
    action$.pipe(
        ofType(
            registrationSectionActionTypes.PROGRAM_CHANGE,
            registrationSectionActionTypes.ORG_UNIT_CHANGE,
            registrationSectionActionTypes.PROGRAM_FILTER_CLEAR,
        ),
        switchMap(() => {
            const state = store.value;
            const { programId, orgUnit } = state.newRelationshipRegisterTei;
            const TETTypeId = state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;

            if (programId && orgUnit) {
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
                    trackerProgram.enrollment.enrollmentForm,
                    orgUnit,
                    DATA_ENTRY_ID,
                    [openDataEntry()],
                    [],
                    state.generatedUniqueValuesCache[DATA_ENTRY_ID],
                );

                return from(openEnrollmentPromise).pipe(
                    takeUntil(action$.pipe(ofType(newRelationshipActionTypes.SELECT_FIND_MODE))),
                );
            }

            if (orgUnit) {
                let TETType: ?TrackedEntityType;
                try {
                    TETType = getTrackedEntityTypeThrowIfNotFound(TETTypeId);
                } catch (error) {
                    log.error(
                        errorCreator('TET for id not found')({ TETTypeId, error }),
                    );
                    return Promise.resolve(openDataEntryFailed(i18n.t('Metadata error. see log for details')));
                }

                const openTeiPromise = openDataEntryForNewTeiBatchAsync(
                    TETType.teiRegistration.form,
                    orgUnit,
                    DATA_ENTRY_ID,
                    [openDataEntry()],
                    state.generatedUniqueValuesCache[DATA_ENTRY_ID],
                );

                return from(openTeiPromise).pipe(
                    takeUntil(action$.pipe(ofType(newRelationshipActionTypes.SELECT_FIND_MODE))),
                );
            }

            return Promise.resolve(openDataEntryCancelled());
        }));
