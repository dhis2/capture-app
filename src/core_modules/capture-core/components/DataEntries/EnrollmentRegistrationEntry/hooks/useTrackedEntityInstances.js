// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useTrackedEntityInstances = (teiId: string, programId: string) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstance: {
                    resource: 'tracker/trackedEntities',
                    id: teiId,
                    params: {
                        program: programId,
                        fields: ['attributes'],
                    },
                },
            }),
            [teiId, programId],
        ),
    );

    return {
        error,
        loading,
        trackedEntityInstanceAttributes: !loading && data?.trackedEntityInstance.attributes,
    };
};
