// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useOrganizationUnit = () => {
    const { loading, data, refetch } = useDataQuery(
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

    const referchOrganizationUnit = (ownerOrgUnit: string) => {
        refetch({ variables: { ownerOrgUnit } });
    };

    return {
        displayName: !loading && data?.organisationUnits?.displayName,
        referchOrganizationUnit,
    };
};
