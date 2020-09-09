// @flow

import { createSelector } from 'reselect';
import {
    getTrackedEntityTypeThrowIfNotFound,
    getTrackerProgramThrowIfNotFound,
} from '../../../../../../../metaData';
import type {
    TrackerProgram,
} from '../../../../../../../metaData';

const programIdSelector = state => state.newRelationshipRegisterTei.programId;
const tetIdSelector = state => state.newRelationship.selectedRelationshipType.to.trackedEntityTypeId;

// $FlowFixMe
export const makeDataElementsSelector = () => createSelector(
    programIdSelector,
    tetIdSelector,
    (programId: ?string, tetId: string) => {
        if (!programId) {
            let teType;
            try {
                teType = getTrackedEntityTypeThrowIfNotFound(tetId);
            } catch (error) {
                return [];
            }

            return teType.attributes
                .filter(attribute => attribute.displayInReports);
        }

        let program: TrackerProgram;
        try {
            program = getTrackerProgramThrowIfNotFound(programId);
        } catch (error) {
            return [];
        }

        return program.attributes
            .filter(attribute => attribute.displayInReports);
    },
);
