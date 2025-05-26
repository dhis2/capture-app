// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useTrackedEntities = (teiId: string, programId: string) => {
    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                trackedEntities: {
                    resource: 'tracker/trackedEntities',
                    id: teiId,
                    params: {
                        fields: ['programOwners[orgUnit],enrollments[program,status]'],
                        program: programId,
                    },
                },
            }),
            [teiId, programId],
        ),
    );

    return {
        error,
        refetch,
        ownerOrgUnit:
            !loading &&
            data?.trackedEntities?.programOwners[0]?.orgUnit,
        enrollments: !loading && data?.trackedEntities ? data?.trackedEntities?.enrollments : [],
    };
};
