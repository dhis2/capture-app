// @flow

import { createSelector } from 'reselect';
import { getEventProgramEventAccess } from '../../../../metaData';

const programIdSelector = (state) => state.currentSelections.programId;
const categoriesMetaSelector = (state) => state.currentSelections.categoriesMeta;

export const makeEventAccessSelector = () =>
  // $FlowFixMe[missing-annot] automated comment
  createSelector(
    programIdSelector,
    categoriesMetaSelector,
    (programId: string, categoriesMeta: ?Object) =>
      getEventProgramEventAccess(programId, categoriesMeta),
  );
