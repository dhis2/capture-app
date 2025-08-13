import { createSelector } from 'reselect';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../../../../metaData';
import type { ReduxState } from '../../../../../App/withAppUrlSync.types';

const programIdSelector = (state: ReduxState) => state.newRelationshipRegisterTei.programId;

export const makeEnrollmentMetadataSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        try {
            const program = getProgramFromProgramIdThrowIfNotFound(programId);
            if (program instanceof TrackerProgram) {
                return program.enrollment;
            }
            return null;
        } catch (error) {
            console.error('Could not get program for id:', programId, error);
            return null;
        }
    },
);
