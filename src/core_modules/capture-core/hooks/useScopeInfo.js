// @flow
import { useMemo } from 'react';
import { getScopeFromScopeId } from '../metaData';
import { deriveInfoFromScope } from '../metaData/helpers/getScopeInfo';

export function useScopeInfo(scopeId: ?string) {
    const scope = useMemo(() => getScopeFromScopeId(scopeId),
        [scopeId]);
    return deriveInfoFromScope(scope);
}
