// @flow
import { useDataQuery } from '@dhis2/app-runtime';
import { useMemo } from 'react';

export const useOrganizationUnit = (ownerOrgUnit: string | boolean) => {
    const { error, loading, data, refetch, called } = useDataQuery(
        useMemo(
            () => ({
                organisationUnits: {
                    resource: 'organisationUnits',
                    id: ({ variables: { ownerOrgUnit: id } }) => id,
                    params: {
                        fields: ['displayName'],
                    },
                },
            }),
            [],
        ),
        {
            lazy: true,
        },
    );

    if (ownerOrgUnit && !called) {
        refetch({ variables: { ownerOrgUnit } });
    }

    return {
        error,
        displayName: !loading && data?.organisationUnits?.displayName,
    };
};
