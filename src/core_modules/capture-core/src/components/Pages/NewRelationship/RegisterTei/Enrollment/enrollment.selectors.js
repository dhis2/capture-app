// @flow
import { createSelector } from 'reselect';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../../../metaData';

const programIdSelector = state => state.newRelationshipRegisterTei.programId;

// $FlowFixMe
export const makeEnrollmentMetadataSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        let program: TrackerProgram;
        try {
            // $FlowSuppress Prechecked that program is a tracker program
            program = getProgramFromProgramIdThrowIfNotFound(programId);
        } catch (error) {
            return null;
        }

        // $FlowFixMe
        return program.enrollment;
    },
);
