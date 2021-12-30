// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useTrackedEntityInstances = (teiId: string, programId: string) => {
    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstances: {
                    resource: 'trackedEntityInstances',
                    id: teiId,
                    params: {
                        program: programId,
                    },
                },
            }),
            [teiId, programId],
        ),
    );
    return { error, loading, trackedEntityInstances: !loading && data?.trackedEntityInstances, refetch };
};
