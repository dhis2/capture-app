import { useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import type { WorkingListTemplate } from '../workingListsBase.types';

type DataResponse = {
    templates?: {
        trackedEntityInstanceFilters?: WorkingListTemplate[];
    };
};

export const useTEITemplates = (programId: string | undefined) => {
    const { error, loading, data, refetch } = useDataQuery({
        templates: {
            resource: 'trackedEntityInstanceFilters',
            params: {
                filter: programId ? `program.id:eq:${programId}` : '',
                fields: 'id,displayName,access,sortOrder',
            },
        },
    }, { lazy: true });

    useEffect(() => {
        if (programId) {
            refetch();
        }
    }, [refetch, programId]);

    return {
        error,
        loading,
        TEITemplates: (data as DataResponse)?.templates?.trackedEntityInstanceFilters || [],
    };
};
