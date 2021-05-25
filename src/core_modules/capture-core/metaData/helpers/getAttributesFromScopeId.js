// @flow
import { TrackerProgram } from '../Program';
import { TrackedEntityType } from '../TrackedEntityType';
import type { DataElement } from '../DataElement';
import { getScopeFromScopeId } from './getScopeFromScopeId';

export const getAttributesFromScopeId = (scopeId: string): Array<DataElement> => {
    const scope = getScopeFromScopeId(scopeId);
    if (scope instanceof TrackerProgram || scope instanceof TrackedEntityType) {
        return [...scope.attributes.values()];
    }
    return [];
};
