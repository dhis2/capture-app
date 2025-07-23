import { createSelector } from 'reselect';
import { getProgramEventAccess } from '../../../metaData';

const programIdSelector = (state: any) => state.currentSelections.programId;
const categoriesMetaSelector = (state: any) => state.currentSelections.categoriesMeta;
const programStageIdSelector = (state: any) => state.currentSelections.stageId;

export const makeEventAccessSelector = () => createSelector(
    programIdSelector,
    categoriesMetaSelector,
    programStageIdSelector,
    (programId: string, categoriesMeta?: Object | null, programStageId?: string | null) =>
        programId && getProgramEventAccess(programId, programStageId, categoriesMeta));
