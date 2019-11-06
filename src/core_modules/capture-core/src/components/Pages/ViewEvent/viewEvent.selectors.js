// @flow

import { createSelector } from 'reselect';
import { getEventProgramEventAccess, getEventProgramThrowIfNotFound } from '../../../metaData';


const programIdSelector = state => state.currentSelections.programId;
const categoriesMetaSelector = state => state.currentSelections.categoriesMeta;

export const makeProgramStageSelector = () => createSelector(
    programIdSelector,
    (programId: string) => getEventProgramThrowIfNotFound(programId).getStageThrowIfNull());

export const makeEventAccessSelector = () => createSelector(
    programIdSelector,
    categoriesMetaSelector,
    (programId: string, categoriesMeta: ?Object) => getEventProgramEventAccess(programId, categoriesMeta));

