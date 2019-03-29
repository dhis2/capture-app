// @flow
import {
    actionTypes as newRelationshipActionTypes,
} from '../newRelationship.actions';
import {
    openDataEntryForNewEnrollmentBatchAsync,
    openDataEntryForNewTeiBatch,
} from '../../../DataEntries';
import {
    initializeRegisterTei,
} from './registerTei.actions';
import { getTrackerProgramThrowIfNotFound, TrackerProgram } from '../../../../metaData';
import { findModes } from '../findModes';
import { DATA_ENTRY_ID } from './registerTei.const';


// get tracker program if the suggested program id is valid for the current context
function getTrackerProgram(suggestedProgramId: string) {
    let trackerProgram: ?TrackerProgram;
    try {
        const program = getTrackerProgramThrowIfNotFound(suggestedProgramId);
        if (program.access.data.write) {
            trackerProgram = program;
        }
    } catch (error) {
        trackerProgram = null;
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

export const openNewRelationshipRegisterTeiEpic = (action$: InputObservable, store: ReduxStore) =>
    // $FlowSuppress
    action$.ofType(newRelationshipActionTypes.SELECT_FIND_MODE)
        .filter(action => action.payload.findMode && action.payload.findMode === findModes.TEI_REGISTER)
        .switchMap((action) => { // eslint-disable-line
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

            const orgUnit = state
                .organisationUnits[orgUnitId];

            if (trackerProgram) { // enrollment form
                return openDataEntryForNewEnrollmentBatchAsync(
                    trackerProgram,
                    trackerProgram && trackerProgram.enrollment.enrollmentForm,
                    orgUnit,
                    DATA_ENTRY_ID,
                    [initializeRegisterTei(trackerProgram.id, orgUnit)],
                );
            }

            // tei (tet attribues) form
            return openDataEntryForNewTeiBatch(
                DATA_ENTRY_ID,
                [initializeRegisterTei(null, orgUnit)],
            );
        });
