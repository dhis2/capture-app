import { createSelector } from 'reselect';
import { getTrackerProgramThrowIfNotFound, TrackerProgram } from '../../../../../../metaData';
import type { ReduxState } from '../../../../../App/withAppUrlSync.types';

const programIdSelector = (state: ReduxState) => state.newRelationshipRegisterTei.programId;

export const makeEnrollmentMetadataSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        let program: TrackerProgram;
        try {
            program = getTrackerProgramThrowIfNotFound(programId);
        } catch (error) {
            console.error('Could not get program for id:', programId, error);
            return null;
        }

        return program.enrollment;
    },
);
