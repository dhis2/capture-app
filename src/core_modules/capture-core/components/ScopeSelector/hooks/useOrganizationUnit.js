// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useOrganizationUnit = () => {
    const { data, refetch } = useDataQuery(
        useMemo(
            () => ({
                organisationUnits: {
                    resource: 'organisationUnits',
                    id: ({ variables: { selectedOrgUnitId: id } }) => id,
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

    return {
        displayName: data?.organisationUnits?.displayName,
        refetch,
    };
};
