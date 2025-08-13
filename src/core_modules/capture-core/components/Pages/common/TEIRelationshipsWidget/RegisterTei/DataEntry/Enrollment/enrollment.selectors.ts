import { createSelector } from 'reselect';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../../../../../metaData';

const programIdSelector = (state: any) => state.newRelationshipRegisterTei.programId;

export const makeEnrollmentMetadataSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        if (!programId) {
            return null;
        }

        try {
            const program = getProgramFromProgramIdThrowIfNotFound(programId);
            if (program instanceof TrackerProgram) {
                return program.enrollment;
            }
            return null;
        } catch (error) {
            console.warn(`Failed to get program metadata for programId: ${programId}`, error);
            return null;
        }
    },
);
