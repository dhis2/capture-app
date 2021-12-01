// @flow
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useOrganisationUnit = (orgUnitId: string) => {
    const orgUnit = useSelector(({ organisationUnits }) => organisationUnits[orgUnitId]);
    const { data, refetch } = useDataQuery(
        useMemo(
            () => ({
                organisationUnits: {
                    resource: 'organisationUnits',
                    id: orgUnitId,
                    params: {
                        fields: [],
                    },
                },
            }),
            [orgUnitId],
        ),
        { lazy: orgUnit?.id !== undefined },
    );

    return {
        orgUnit: orgUnit ?? data?.organisationUnits,
        refetch,
    };
};
