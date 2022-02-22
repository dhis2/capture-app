// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useTrackedEntityInstances = (teiId: string, programId: string) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstances: {
                    resource: `tracker/trackedEntities/${teiId}`,
                    params: {
                        fields: ['programOwners[ownerOrgUnit]'],
                        program: [programId],
                    },
                },
            }),
            [teiId, programId],
        ),
    );

    return {
        error,
        tetId: !loading &&
            data?.trackedEntityInstances?.trackedEntityType ? data.trackedEntityInstances.trackedEntityType : '',
        ownerOrgUnit:
            !loading &&
            data?.trackedEntityInstances?.programOwners[0]?.orgUnit,
    };
};
