// @flow
import { useMemo } from 'react';
import { useApiDataQuery } from '../../../utils/reactQueryHelpers';

export const useEventTemplates = (programId: string) => {
    const query = useMemo(() => ({
        resource: 'eventFilters',
        params: {
            filter: `program:eq:${programId}`,
            fields: `
                id,displayName,eventQueryCriteria,access,externalAccess,publicAccess,
                user[id,username],
                userAccesses[id,access],
                userGroupAccesses[id,access]
            `,
        },
    }), [programId]);

    const { data, isLoading, error } = useApiDataQuery(
        ['eventTemplates', programId],
        query,
        {
            enabled: !!programId,
            select: (response: any) => response?.eventFilters || [],
        },
    );

    return {
        error,
        loading: isLoading,
        eventTemplates: data || [],
    };
};
