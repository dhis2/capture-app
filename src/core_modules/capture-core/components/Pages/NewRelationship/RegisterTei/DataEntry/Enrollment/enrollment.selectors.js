// @flow
import { createSelector } from 'reselect';
import type { TrackerProgram } from '../../../../../../metaData';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../../../metaData';

const programIdSelector = state => state.newRelationshipRegisterTei.programId;

// $FlowFixMe
export const makeEnrollmentMetadataSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        let program: TrackerProgram;
        try {
            // $FlowFixMe[incompatible-type] automated comment
            program = getProgramFromProgramIdThrowIfNotFound(programId);
        } catch (error) {
            return null;
        }

        // $FlowFixMe
        return program.enrollment;
    },
);
