import { createSelector } from 'reselect';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../../../../metaData';

const programIdSelector = (state: any) => state.newRelationshipRegisterTei.programId;

export const makeEnrollmentMetadataSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        if (!programId) {
            return null;
        }

        try {
            const program = getProgramFromProgramIdThrowIfNotFound(programId);
            return program.enrollment;
        } catch (error) {
            console.warn(`Failed to get program metadata for programId: ${programId}`, error);
            return null;
        }
    },
);
