// @flow
import { useMemo, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useTrackedEntityInstances = (teiId: string, programId: string) => {
    const { loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstance: {
                    resource: 'tracker/trackedEntities',
                    id: ({ variables: { id } }) => id,
                    params: {
                        program: programId,
                        fields: ['attributes'],
                    },
                },
            }),
            [programId],
        ),
    );

    useEffect(() => {
        if (teiId) {
            refetch({ variables: { id: teiId } });
        }
    }, [refetch, teiId]);

    return {
        trackedEntityInstanceAttributes: teiId ? !loading && data?.trackedEntityInstance.attributes : undefined,
    };
};
