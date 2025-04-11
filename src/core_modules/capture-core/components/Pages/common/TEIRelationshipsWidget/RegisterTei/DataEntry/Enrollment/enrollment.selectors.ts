import { createSelector } from 'reselect';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../../../../metaData';

type State = {
    newRelationshipRegisterTei: {
        programId: string;
    };
}

const programIdSelector = (state: State) => state.newRelationshipRegisterTei.programId;

export const makeEnrollmentMetadataSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        // TODO: Add back TrackerProgram type once the TrackerProgram class is refactored
        let program: any;
        try {
            program = getProgramFromProgramIdThrowIfNotFound(programId);
        } catch (error) {
            return null;
        }

        return program.enrollment;
    },
);
