// @flow

import { createSelector } from 'reselect';
import { getEventProgramEventAccess, getEventProgramThrowIfNotFound } from '../../../metaData';


const programIdSelector = state => state.currentSelections.programId;
const categoriesSelector = state => state.currentSelections.categories;

export const makeProgramStageSelector = () => createSelector(
    programIdSelector,
    (programId: string) => getEventProgramThrowIfNotFound(programId).getStageThrowIfNull());

export const makeEventAccessSelector = () => createSelector(
    programIdSelector,
    categoriesSelector,
    (programId: string, categories: ?Object) => getEventProgramEventAccess(programId, categories));

