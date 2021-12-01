// @flow
import { useDataQuery } from '@dhis2/app-runtime';
import { useMemo } from 'react';

export const useTrackedEntityInstances = (teiId: string, programId: string) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                trackedEntityInstances: {
                    resource: `trackedEntityInstances/${teiId}`,
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
        ownerOrgUnit:
            !loading &&
            data?.trackedEntityInstances?.programOwners[0]?.ownerOrgUnit,
    };
};
