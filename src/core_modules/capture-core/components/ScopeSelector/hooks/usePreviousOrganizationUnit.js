// @flow
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useDataQuery } from '@dhis2/app-runtime';

export const usePreviousOrganizationUnit = () => {
    const previousOrgUnitId = useSelector(({ app }) => app.previousOrgUnit);

    const { data, refetch } = useDataQuery(
        useMemo(
            () => ({
                organisationUnits: {
                    resource: 'organisationUnits',
                    id: ({ variables: { previousOrgUnitId: id } }) => id,
                    params: {
                        fields: ['displayName,path'],
                    },
                },
            }),
            [],
        ),
        {
            lazy: true,
        },
    );

    useEffect(() => {
        if (previousOrgUnitId) {
            refetch({ variables: { previousOrgUnitId } });
        }
    }, [previousOrgUnitId, refetch]);

    return {
        id: previousOrgUnitId,
        displayName: data?.organisationUnits?.displayName,
        path: data?.organisationUnits?.path,
    };
};
