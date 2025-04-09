import { useMemo, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import type { WorkingListTemplate } from '../workingListsBase.types';

type DataResponse = {
    templates?: {
        trackedEntityInstanceFilters?: WorkingListTemplate[];
    };
};

export const useTEITemplates = (programId: string) => {
    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                templates: {
                    resource: 'trackedEntityInstanceFilters',
                    params: {
                        filter: `program.id:eq:${programId}`,
                        fields: 'id,displayName,access,sortOrder',
                    },
                },
            }),
            [programId],
        ),
        { lazy: true },
    );

    useEffect(() => {
        refetch();
    }, [refetch, programId]);

    return {
        error,
        loading,
        TEITemplates: (data as DataResponse)?.templates?.trackedEntityInstanceFilters || [],
    };
};
