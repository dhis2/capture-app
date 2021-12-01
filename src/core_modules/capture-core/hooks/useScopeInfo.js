// @flow
import { useMemo } from 'react';
import { deriveInfoFromScope } from '../metaData/helpers/getScopeInfo';
import { getScopeFromScopeId } from '../metaData';

export function useScopeInfo(scopeId: ?string) {
    const scope = useMemo(() => getScopeFromScopeId(scopeId),
        [scopeId]);
    return deriveInfoFromScope(scope);
}
