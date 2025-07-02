import { createSelector } from 'reselect';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../../../metaData';

const programIdSelector = (state: any) => state.newRelationshipRegisterTei.programId;

export const makeEnrollmentMetadataSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        let program: any;
        try {
            program = getProgramFromProgramIdThrowIfNotFound(programId);
        } catch (error) {
            console.error('Could not get program for id:', programId, error);
            return null;
        }

        return program.enrollment;
    },
);
