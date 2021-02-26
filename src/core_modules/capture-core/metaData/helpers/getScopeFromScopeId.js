// @flow
import { EventProgram, TrackerProgram } from '../Program';
import { TrackedEntityType } from '../TrackedEntityType';
import { programCollection, trackedEntityTypesCollection } from '../../metaDataMemoryStores';

export type Scope = (EventProgram | TrackerProgram | TrackedEntityType)

export function getScopeFromScopeId(scopeId: ?string): ?Scope {
    if (!scopeId) {
        return null;
    }
    const scope = programCollection.get(scopeId) || trackedEntityTypesCollection.get(scopeId);
    if (scope instanceof EventProgram || scope instanceof TrackerProgram || scope instanceof TrackedEntityType) {
        return scope;
    }
    return null;
}
