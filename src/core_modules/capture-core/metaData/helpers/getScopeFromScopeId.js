// @flow
import { getProgramFromProgramIdThrowIfNotFound, getTrackedEntityTypeThrowIfNotFound } from './index';
import { Program } from '../Program';
import { TrackedEntityType } from '../TrackedEntityType';

export const scopeTypes = {
    TRACKER_PROGRAM: 'TRACKER_PROGRAM',
    EVENT_PROGRAM: 'EVENT_PROGRAM',
    TRACKED_ENTITY_TYPE: 'TRACKED_ENTITY_TYPE',
};

//todo EVENTPROGRAM | TRACKER PROGRAM
type Scope = Program | TrackedEntityType
export function getScopeFromScopeId(scopeId: ?string): ?Scope {
    if (!scopeId) {
        return null;
    }

    let scope;
    try {
        scope = getProgramFromProgramIdThrowIfNotFound(scopeId);
    } catch {
        try {
            scope = getTrackedEntityTypeThrowIfNotFound(scopeId);
        } catch {
            return null;
        }
    }

    return scope;
}
