// @flow

import { createSelector } from 'reselect';
import { getEventProgramEventAccess } from '../../../metaData';


const programIdSelector = state => state.currentSelections.programId;
const categoriesMetaSelector = state => state.currentSelections.categoriesMeta;
const programStageIdSelector = state => state.router.location.query.stageId;

// $FlowFixMe[missing-annot] automated comment
export const makeEventAccessSelector = () => createSelector(
    programIdSelector,
    categoriesMetaSelector,
    programStageIdSelector,
    (programId: string, categoriesMeta: ?Object, programStageId: ?string) =>
        programId && getEventProgramEventAccess(programId, categoriesMeta, programStageId));

