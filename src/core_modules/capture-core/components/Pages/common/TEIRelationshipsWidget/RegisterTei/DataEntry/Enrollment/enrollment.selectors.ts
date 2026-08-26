import { createSelector } from 'reselect';
import { getTrackerProgramThrowIfNotFound } from '../../../../../../../metaData';

const programIdSelector = (state: any) => state.newRelationshipRegisterTei.programId;

export const makeEnrollmentMetadataSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        if (!programId) {
            return null;
        }

        try {
            const program = getTrackerProgramThrowIfNotFound(programId);
            return program.enrollment;
        } catch (error) {
            console.warn(`Failed to get program metadata for programId: ${programId}`, error);
            return null;
        }
    },
);
