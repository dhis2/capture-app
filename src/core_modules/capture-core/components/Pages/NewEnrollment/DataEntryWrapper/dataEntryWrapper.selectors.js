// @flow
import { createSelector } from 'reselect';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../../../metaData';

const programIdSelector = (state) => state.currentSelections.programId;

export const makeEnrollmentMetadataSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(programIdSelector, (programId: string) => {
    let program: TrackerProgram;
    try {
      // $FlowFixMe[incompatible-type] automated comment
      program = getProgramFromProgramIdThrowIfNotFound(programId);
    } catch (error) {
      return null;
    }

    // $FlowFixMe[prop-missing] automated comment
    if (!program.enrollment) {
      log.error(
        errorCreator(`could not find enrollment specification for ${programId}`)({ program }),
      );
      return null;
    }

    return program.enrollment;
  });
