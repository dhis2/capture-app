import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type TrackedEntityInstanceData = {
    programOwners: Array<{
        orgUnit: string;
    }>;
    enrollments: Array<any>;
};

export const useTrackedEntityInstances = (teiId: string, programId: string) => {
    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstances: {
                    resource: `tracker/trackedEntities/${teiId}`,
                    params: {
                        fields: ['programOwners[orgUnit],enrollments'],
                        program: [programId],
                    },
                },
            }),
            [teiId, programId],
        ),
    );

    const trackedEntityInstances = data?.trackedEntityInstances as TrackedEntityInstanceData | undefined;

    return {
        error,
        refetch,
        ownerOrgUnit:
            !loading &&
            trackedEntityInstances?.programOwners[0]?.orgUnit,
        enrollments: !loading && trackedEntityInstances ? trackedEntityInstances.enrollments : [],
    };
};
