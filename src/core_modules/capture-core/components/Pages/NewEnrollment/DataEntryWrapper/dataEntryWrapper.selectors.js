// @flow
import { createSelector } from 'reselect';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../../metaData';

const programIdSelector = state => state.currentSelections.programId;

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

        if (!program.enrollment) {
            log.error(
                errorCreator(`could not find enrollment specification for ${programId}`)({ program }),
            );
            return null;
        }

        return program.enrollment;
    },
);
