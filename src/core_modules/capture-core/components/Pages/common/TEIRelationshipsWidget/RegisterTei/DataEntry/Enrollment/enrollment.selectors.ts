import { createSelector } from 'reselect';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../../../../metaData';

interface State {
    newRelationshipRegisterTei: {
        programId: string;
    };
}

const programIdSelector = (state: State) => state.newRelationshipRegisterTei.programId;

export const makeEnrollmentMetadataSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        let program: any;
        try {
            program = getProgramFromProgramIdThrowIfNotFound(programId);
        } catch (error) {
            return null;
        }

        return program.enrollment;
    },
);
