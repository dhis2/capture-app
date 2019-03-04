// @flow
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    actionTypes as newRelationshipActionTypes,
} from '../newRelationship.actions';
import {
    openDataEntryForNewEnrollmentBatch,
    // runRulesOnUpdateFieldBatch,
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

// get tracker program if the suggested program id is valid for the current context
function getTrackerProgram(suggestedProgramId: string) {
    let trackerProgram: TrackerProgram;
    try {
        const program = getProgramFromProgramIdThrowIfNotFound(suggestedProgramId);
        if (!(program instanceof TrackerProgram)) {
            log.error(
                errorCreator(
                    errorMessages.NOT_TRACKER_PROGRAM)(
                    { method: 'openRelationshipRegisterTeiEpic', program }),
            );
        } else if (program.access.data.write) {
            trackerProgram = program;
        }
    } catch (error) {
        log.error(
            errorCreator(
                errorMessages.PROGRAM_NOT_FOUND)(
                { method: 'openRelationshipRegisterTeiEpic', error, suggestedProgramId }),
        );
    }
    return trackerProgram;
}

function getOrgUnitId(suggestedOrgUnitId: string, trackerProgram: ?TrackerProgram) {
    let orgUnitId;
    if (trackerProgram) {
        orgUnitId = trackerProgram.organisationUnits[suggestedOrgUnitId] ? suggestedOrgUnitId : null;
    } else {
        orgUnitId = suggestedOrgUnitId;
    }
    return orgUnitId;
}

export const openRegisterTeiForRelationshipEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newRelationshipActionTypes.SELECT_FIND_MODE)
        .filter(action => action.payload.findMode && action.payload.findMode === findModes.TEI_REGISTER)
        .map((action) => { // eslint-disable-line
            const state = store.getState();
            const selectedRelationshipType = state.newRelationship.selectedRelationshipType;
            const { programId: suggestedProgramId, trackedEntityTypeId } = selectedRelationshipType.to; // eslint-disable-line
            const { orgUnitId: suggestedOrgUnitId } = state.currentSelections;

            const trackerProgram: ?TrackerProgram = suggestedProgramId ? getTrackerProgram(suggestedProgramId) : null;
            const orgUnitId = getOrgUnitId(suggestedOrgUnitId, trackerProgram);

            // can't run rules when no valid organisation unit is specified, i.e. only the registration section will be visible
            if (!orgUnitId) {
                return initializeRegisterTei(trackerProgram && trackerProgram.id);
            }

            if (trackerProgram) { // enrollment form
                const orgUnit = state.organisationUnits[orgUnitId];
                return openDataEntryForNewEnrollmentBatch(
                    trackerProgram,
                    trackerProgram && trackerProgram.enrollment.enrollmentForm,
                    orgUnit,
                    'relationship',
                    [initializeRegisterTei(trackerProgram.id, orgUnitId)],
                );
            }


            // TEI form (TEI from TET attributes)
        });
