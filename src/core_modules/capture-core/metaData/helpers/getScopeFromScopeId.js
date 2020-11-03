// @flow
import { getProgramFromProgramIdThrowIfNotFound, getTrackedEntityTypeThrowIfNotFound } from './index';

export const scopeTypes = {
    TRACKER_PROGRAM: 'TRACKER_PROGRAM',
    EVENT_PROGRAM: 'EVENT_PROGRAM',
    TRACKED_ENTITY_TYPE: 'TRACKED_ENTITY_TYPE',
};

export function getScopeFromScopeId(scopeId: ?string): any {
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
