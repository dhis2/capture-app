import { createSelector } from 'reselect';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../../../../metaData';

const programIdSelector = state => state.newRelationshipRegisterTei.programId;

export const makeEnrollmentMetadataSelector = () => createSelector(
    programIdSelector,
    (programId) => {
        let program;
        try {
            program = getProgramFromProgramIdThrowIfNotFound(programId);
        } catch (error) {
            return null;
        }

        return program.enrollment;
    },
);
