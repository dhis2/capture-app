// @flow
import { createSelector } from 'reselect';
import { getEventProgramThrowIfNotFound } from '../../../../../metaData';

const getProgramId = (state) => state.currentSelections.programId;
export const makeProgramStageIdSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(getProgramId, (programId) => {
    const eventProgram = getEventProgramThrowIfNotFound(programId);
    return eventProgram.stage.id;
  });
