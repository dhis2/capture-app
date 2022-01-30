// @flow

import { createSelector } from 'reselect';
import { getProgramEventAccess } from '../../../metaData';


const programIdSelector = state => state.currentSelections.programId;
const categoriesMetaSelector = state => state.currentSelections.categoriesMeta;
const programStageIdSelector = state => state.currentSelections.stageId;

// $FlowFixMe[missing-annot] automated comment
export const makeEventAccessSelector = () => createSelector(
    programIdSelector,
    categoriesMetaSelector,
    programStageIdSelector,
    (programId: string, categoriesMeta: ?Object, programStageId: ?string) =>
        programId && getProgramEventAccess(programId, programStageId, categoriesMeta));
