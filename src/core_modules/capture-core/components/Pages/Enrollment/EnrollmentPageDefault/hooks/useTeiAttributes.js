// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useTeiAttributes = (teiId: string) => {
    const { data, error, loading, refetch } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstance: {
                    resource: 'tracker/trackedEntities',
                    id: teiId,
                    params: { fields: ['attributes'] },
                },
            }),
            [teiId],
        ),
    );

    return {
        error,
        refetch,
        attributes: !loading && data?.trackedEntityInstance?.attributes,
    };
};
