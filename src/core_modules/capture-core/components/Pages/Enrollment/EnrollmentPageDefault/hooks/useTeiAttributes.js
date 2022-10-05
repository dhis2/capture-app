// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useTeiAttributes = (teiId: string) => {
    const { data, error, loading } = useDataQuery(
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
        attributes: !loading && data?.trackedEntityInstance?.attributes,
    };
};
