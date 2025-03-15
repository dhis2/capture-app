// @flow
import { useMemo } from 'react';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';

export const useTrackedEntityTypeName = (tetId: string) => {
    const query = useMemo(() => ({
        resource: 'trackedEntityTypes',
        id: tetId,
        params: {
            fields: 'displayFormName',
        },
    }), [tetId]);

    const { data, isLoading, error } = useApiDataQuery<?string>(
        ['trackedEntityTypeName', tetId],
        query,
        {
            enabled: !!tetId,
            select: ({ displayFormName }: any) => displayFormName,
        });

    return {
        data,
        isLoading,
        error,
    };
};
