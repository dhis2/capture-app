// @flow
import { fromPromise } from 'rxjs/observable/fromPromise';
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

    // $FlowFixMe[prop-missing] automated comment
    action$.ofType(
        registrationSectionActionTypes.PROGRAM_CHANGE,
        registrationSectionActionTypes.ORG_UNIT_CHANGE,
        registrationSectionActionTypes.PROGRAM_FILTER_CLEAR,
    )
        .switchMap(() => {
            const state = store.getState();
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

                return fromPromise(openEnrollmentPromise)
                    // $FlowFixMe[prop-missing] automated comment
                    .takeUntil(action$.ofType(newRelationshipActionTypes.SELECT_FIND_MODE));
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

                return fromPromise(openTeiPromise)
                    // $FlowFixMe[prop-missing] automated comment
                    .takeUntil(action$.ofType(newRelationshipActionTypes.SELECT_FIND_MODE));
            }

            return Promise.resolve(openDataEntryCancelled());
        });
