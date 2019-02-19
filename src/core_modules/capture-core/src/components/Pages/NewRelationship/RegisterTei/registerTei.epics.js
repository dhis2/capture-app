// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    actionTypes as newRelationshipActionTypes,
} from '../newRelationship.actions';
import {
    openDataEntryForNewEnrollmentBatch,
    runRulesOnUpdateFieldBatch,
} from '../../../DataEntries';
import {
    initializeRegisterTei,
} from './registerTei.actions';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../../metaData';
import { findModes } from '../findModes';

const errorMessages = {
    PROGRAM_NOT_FOUND: 'Program not found',
    NOT_TRACKER_PROGRAM: 'Program is not a tracker program',
};

export const openRegisterTeiForRelationshipEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newRelationshipActionTypes.SELECT_FIND_MODE)
        .filter(action => action.payload.findMode && action.payload.findMode === findModes.TEI_REGISTER)
        .map((action) => {
            const state = store.getState();
            const selectedRelationshipType = state.newRelationship.selectedRelationshipType;
            const { programId, trackedEntityTypeId } = selectedRelationshipType.to;
            const { orgUnitId } = state.currentSelections;
            const orgUnit = state.organisationUnits[orgUnitId];

            if (programId) { // enrollment form
                let trackerProgram: TrackerProgram;
                try {
                    const program = getProgramFromProgramIdThrowIfNotFound(programId);
                    if (!(program instanceof TrackerProgram)) {
                        log.error(
                            errorCreator(
                                errorMessages.NOT_TRACKER_PROGRAM)(
                                { method: 'openRelationshipRegisterTeiEpic', program }),
                        );
                    } else {
                        trackerProgram = program;
                    }
                } catch (error) {
                    log.error(
                        errorCreator(
                            errorMessages.PROGRAM_NOT_FOUND)(
                            { method: 'openRelationshipRegisterTeiEpic', error, programId }),
                    );
                }

                return openDataEntryForNewEnrollmentBatch(
                    trackerProgram,
                    trackerProgram && trackerProgram.enrollment.enrollmentForm,
                    orgUnit,
                    'relationship',
                    [initializeRegisterTei(programId, orgUnitId)],
                );
            } else { // TEI form (TEI from TET attributes)

            }
        });
