// @flow
import { createSelector } from 'reselect';
import log from 'loglevel';
import errorCreator from '../../../../utils/errorCreator';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../../metaData';

const programIdSelector = state => state.currentSelections.programId;

export const makeFormFoundationSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        let program: TrackerProgram;
        try {
            // $FlowSuppress Prechecked that program is a trackerProgram
            program = getProgramFromProgramIdThrowIfNotFound(programId);
        } catch (error) {
            return null;
        }

        if (!program.enrollment) {
            
        }

        return stage.stageForm;
    },
);
