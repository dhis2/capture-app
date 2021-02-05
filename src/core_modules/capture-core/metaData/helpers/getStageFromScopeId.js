// @flow
import { EventProgram, ProgramStage, TrackerProgram } from '../Program';
import { getScopeFromScopeId } from './getScopeFromScopeId';

export const getStageFromScopeId = (scopeId: string): Array<ProgramStage> => {
    const scope = getScopeFromScopeId(scopeId);
    if (scope instanceof EventProgram || scope instanceof TrackerProgram) {
        return [...scope.stages.values()];
    }
    return [];
};
