// @flow

import { createSelector } from 'reselect';
import { getEventProgramEventAccess, getEventProgramThrowIfNotFound } from '../../../../metaData';

const programIdSelector = (state) => state.currentSelections.programId;
const categoriesMetaSelector = (state) => state.currentSelections.categoriesMeta;

export const makeProgramStageSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(
    programIdSelector,
    (programId: string) => getEventProgramThrowIfNotFound(programId).stage,
  );

export const makeEventAccessSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(
    programIdSelector,
    categoriesMetaSelector,
    (programId: string, categoriesMeta: ?Object) =>
      getEventProgramEventAccess(programId, categoriesMeta),
  );
