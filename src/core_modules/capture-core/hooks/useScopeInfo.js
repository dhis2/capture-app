import { useMemo } from 'react';
import { getScopeFromScopeId } from '../metaData/helpers';
import { EventProgram, TrackerProgram } from '../metaData/Program';
import { scopeTypes, TrackedEntityType } from '../metaData';

export function useScopeInfo(scopeId: ?string) {
    const scope = useMemo(() => getScopeFromScopeId(scopeId),
        [scopeId]);

    if (scope instanceof EventProgram) {
        const trackedEntityName = '';
        const programName = scope.name;

        return { trackedEntityName, programName, scopeType: scopeTypes.EVENT_PROGRAM };
    } else if (scope instanceof TrackerProgram) {
        const trackedEntityName = scope.trackedEntityType ? scope.trackedEntityType.name.toLowerCase() : '';
        const programName = scope.name;

        return { trackedEntityName, programName, scopeType: scopeTypes.TRACKER_PROGRAM };
    } else if (scope instanceof TrackedEntityType) {
        const trackedEntityName = scope.name;
        const programName = '';

        return { trackedEntityName, programName, scopeType: scopeTypes.TRACKED_ENTITY_TYPE };
    }
    return { programName: '', scopeType: '', trackedEntityName: '' };
}
