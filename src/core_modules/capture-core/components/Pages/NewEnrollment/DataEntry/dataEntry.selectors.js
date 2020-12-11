// @flow
import { createSelector } from 'reselect';
import { getProgramFromProgramIdThrowIfNotFound } from '../../../../metaData';

const programIdSelector = (state) => state.currentSelections.programId;

export const makeProgramNameSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(programIdSelector, (programId: string) => {
    const program = getProgramFromProgramIdThrowIfNotFound(programId);
    const programName = (program && program.name) || '';
    return programName;
  });
