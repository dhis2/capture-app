// @flow
import { createSelector } from 'reselect';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../metaData';

const programIdSelector = state => state.currentSelections.programId;

// $FlowFixMe[missing-annot] automated comment
export const makeProgramNameSelector = () => createSelector(
    programIdSelector,
    (programId: string) => {
        const program = getProgramFromProgramIdThrowIfNotFound(programId);
        const programName = (program && program.name) || '';
        return programName;
    },
);
