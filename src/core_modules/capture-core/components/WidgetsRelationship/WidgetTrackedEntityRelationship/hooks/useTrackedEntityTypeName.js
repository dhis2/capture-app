// @flow
import { useMemo } from 'react';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';

export const useTrackedEntityTypeName = (tetId: string) => {
    const query = useMemo(() => ({
        resource: 'trackedEntityTypes',
        id: tetId,
        params: {
            fields: 'displayName',
        },
    }), [tetId]);

    const { data, isLoading, error } = useApiDataQuery<?string>(
        ['trackedEntityTypeName', tetId],
        query,
        {
            enabled: !!tetId,
            select: ({ displayName }: any) => displayName,
        });

    return {
        data,
        isLoading,
        error,
    };
};
