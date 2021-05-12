// @flow
import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { filter, switchMap } from 'rxjs/operators';
import log from 'loglevel';
import i18n from '@dhis2/d2-i18n';
import { errorCreator } from 'capture-core-utils';
import {
    actionTypes as newRelationshipActionTypes,
} from '../newRelationship.actions';
import {
    initializeRegisterTei,
    initializeRegisterTeiFailed,
} from './registerTei.actions';
import {
    getTrackerProgramThrowIfNotFound,
    type TrackerProgram,
} from '../../../../metaData';
import { findModes } from '../findModes';

// get tracker program if the suggested program id is valid for the current context
function getTrackerProgram(suggestedProgramId: string) {
    let trackerProgram: ?TrackerProgram;
    try {
        const program = getTrackerProgramThrowIfNotFound(suggestedProgramId);
        if (program.access.data.write) {
            trackerProgram = program;
        }
    } catch (error) {
        log.error(
            errorCreator('tracker program for id not found')({ suggestedProgramId, error }),
        );
        throw Error(i18n('Metadata error. see log for details'));
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
    action$.pipe(
        ofType(newRelationshipActionTypes.SELECT_FIND_MODE),
        filter(action => action.payload.findMode && action.payload.findMode === findModes.TEI_REGISTER),
        switchMap(() => {
            const state = store.value;
            const selectedRelationshipType = state.newRelationship.selectedRelationshipType;
            const { programId: suggestedProgramId } = selectedRelationshipType.to;
            const { orgUnitId: suggestedOrgUnitId } = state.currentSelections;

            let trackerProgram: ?TrackerProgram;
            if (suggestedProgramId) {
                try {
                    trackerProgram = getTrackerProgram(suggestedProgramId);
                } catch (error) {
                    return Promise.resolve(initializeRegisterTeiFailed(error));
                }
            }
            const orgUnitId = getOrgUnitId(suggestedOrgUnitId, trackerProgram);

            // can't run rules when no valid organisation unit is specified, i.e. only the registration section will be visible
            if (!orgUnitId) {
                return Promise.resolve(initializeRegisterTei(trackerProgram && trackerProgram.id));
            }
            const orgUnit = state
                .organisationUnits[orgUnitId];

            return of(initializeRegisterTei(null, orgUnit));
        }));
