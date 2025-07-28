import { useEffect, useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type PreviousOrganizationUnitResult = {
    id?: string;
    displayName?: string;
    path?: string;
    expandedPaths?: string[];
};

export const usePreviousOrganizationUnit = (previousOrgUnitId?: string): PreviousOrganizationUnitResult => {
    const { data, refetch }: {data?: any, refetch: any } = useDataQuery(
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

    const expandedPaths = useMemo(() => {
        const paths = data?.organisationUnits?.path.split('/').filter(p => p);
        return paths?.map((_, index) => `/${paths.slice(0, index + 1).join('/')}`);
    }, [data?.organisationUnits?.path]);

    return {
        id: previousOrgUnitId,
        displayName: data?.organisationUnits?.displayName,
        path: data?.organisationUnits?.path,
        expandedPaths,
    };
};
