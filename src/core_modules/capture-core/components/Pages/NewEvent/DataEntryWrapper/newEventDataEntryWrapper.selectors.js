// @flow
import { createSelector } from 'reselect';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import programCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';

const programIdSelector = (state) => state.currentSelections.programId;

export const makeFormFoundationSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(programIdSelector, (programId: string) => {
    const program = programCollection.get(programId);
    if (!program) {
      log.error(errorCreator('programId not found')({ method: 'getFormFoundation' }));
      return null;
    }

    // $FlowFixMe[prop-missing] automated comment
    const { stage } = program;
    if (!stage) {
      log.error(errorCreator('stage not found for program')({ method: 'getFormFoundation' }));
      return null;
    }

    return stage.stageForm;
  });

export const makeStageSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(programIdSelector, (programId: string) => {
    const program = programCollection.get(programId);
    if (!program) {
      log.error(errorCreator('programId not found')({ method: 'getFormFoundation' }));
      return null;
    }

    // $FlowFixMe[prop-missing] automated comment
    const { stage } = program;
    if (!stage) {
      log.error(errorCreator('stage not found for program')({ method: 'getFormFoundation' }));
      return null;
    }

    return stage;
  });
