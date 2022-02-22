// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useTrackedEntityInstances = (teiId: string, programId: string) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstances: {
                    resource: 'tracker/trackedEntities',
                    id: teiId,
                    params: {
                        program: programId,
                    },
                },
            }),
            [teiId, programId],
        ),
    );
    return { error, loading, trackedEntityInstances: !loading && data?.trackedEntityInstances };
};
