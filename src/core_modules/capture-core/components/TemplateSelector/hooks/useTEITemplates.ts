import { useApiDataQuery } from 'capture-core/utils/reactQueryHelpers';
import type { WorkingListTemplate } from '../workingListsBase.types';

type DataResponse = {
    trackedEntityInstanceFilters?: WorkingListTemplate[];
};

export const useTEITemplates = (programId: string | undefined) => {
    const { error, isInitialLoading, data } = useApiDataQuery<DataResponse>(
        ['trackedEntityInstanceFilters', programId],
        {
            resource: 'trackedEntityInstanceFilters',
            params: {
                filter: `program.id:eq:${programId}`,
                fields: 'id,displayName,access,sortOrder',
            },
        },
        {
            enabled: !!programId,
        },
    );

    return {
        error,
        loading: isInitialLoading,
        TEITemplates: data?.trackedEntityInstanceFilters || [],
    };
};
