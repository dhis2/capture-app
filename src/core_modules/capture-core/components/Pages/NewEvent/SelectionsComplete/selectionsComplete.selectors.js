// @flow

import { createSelector } from 'reselect';
import { getEventProgramEventAccess } from '../../../../metaData';


const programIdSelector = state => state.currentSelections.programId;
const categoriesMetaSelector = state => state.currentSelections.categoriesMeta;


// $FlowFixMe[missing-annot] automated comment
export const makeEventAccessSelector = () => createSelector(
    programIdSelector,
    categoriesMetaSelector,
    (programId: string, categoriesMeta: ?Object) => getEventProgramEventAccess(programId, categoriesMeta));

