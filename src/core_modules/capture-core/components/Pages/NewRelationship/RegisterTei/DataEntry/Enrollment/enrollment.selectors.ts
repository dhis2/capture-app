import { createSelector } from 'reselect';
import { getProgramFromProgramIdThrowIfNotFound, type TrackerProgram } from '../../../../../../metaData';

type ReduxState = {
    newRelationshipRegisterTei: {
        programId: string;
    };
};

const programIdSelector = (state: ReduxState) => state.newRelationshipRegisterTei.programId;

export const makeEnrollmentMetadataSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        let program: TrackerProgram;
        try {
            program = getProgramFromProgramIdThrowIfNotFound(programId);
        } catch (error) {
            console.error('Could not get program for id:', programId, error);
            return null;
        }

        return program.enrollment;
    },
);
