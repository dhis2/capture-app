// @flow
import { EventProgram, TrackerProgram } from '../Program';
import { TrackedEntityType } from '../TrackedEntityType';
import { getScopeFromScopeId } from './getScopeFromScopeId';
import { scopeTypes } from './constants';
import type { Scope } from './getScopeFromScopeId';

export const getScopeInfo = (scopeId: ?string) => {
    const scope = getScopeFromScopeId(scopeId);
    return deriveInfoFromScope(scope);
};

export const deriveInfoFromScope = (scope: ?Scope) => {
    if (scope instanceof EventProgram) {
        const trackedEntityName = '';
        const programName = scope.name;

        return { trackedEntityName, programName, scopeType: scopeTypes.EVENT_PROGRAM, tetId: null };
    } else if (scope instanceof TrackerProgram) {
        const trackedEntityName = scope.trackedEntityType ? scope.trackedEntityType.name.toLowerCase() : '';
        const programName = scope.name;
        return { trackedEntityName, programName, scopeType: scopeTypes.TRACKER_PROGRAM, tetId: scope.trackedEntityType.id };
    } else if (scope instanceof TrackedEntityType) {
        const trackedEntityName = scope.name.toLowerCase();
        const programName = '';

        return { trackedEntityName, programName, scopeType: scopeTypes.TRACKED_ENTITY_TYPE, tetId: scope.id };
    }
    return { programName: '', scopeType: '', trackedEntityName: '', tetId: '' };
};
