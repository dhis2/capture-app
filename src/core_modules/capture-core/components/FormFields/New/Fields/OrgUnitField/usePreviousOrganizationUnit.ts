import { useEffect, useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

type PreviousOrganizationUnitResult = {
    id?: string;
    displayName?: string;
    path?: string;
    expandedPaths?: string[];
};

export const usePreviousOrganizationUnit = (previousOrgUnitId?: string): PreviousOrganizationUnitResult => {
    const { data, refetch } = useDataQuery(
        useMemo(
            () => ({
                organisationUnits: {
                    resource: 'organisationUnits',
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
            refetch({ id: previousOrgUnitId });
        }
    }, [previousOrgUnitId, refetch]);

    const expandedPaths = useMemo(() => {
        const orgUnit = data?.organisationUnits as any;
        const paths = orgUnit?.path?.split('/').filter((p: string) => p);
        return paths?.map((_: any, index: number) => `/${paths.slice(0, index + 1).join('/')}`);
    }, [data?.organisationUnits]);

    return {
        id: previousOrgUnitId,
        displayName: (data?.organisationUnits as any)?.displayName,
        path: (data?.organisationUnits as any)?.path,
        expandedPaths,
    };
};
