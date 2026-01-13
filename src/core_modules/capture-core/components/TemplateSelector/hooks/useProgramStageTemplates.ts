import { useApiDataQuery } from 'capture-core/utils/reactQueryHelpers';
import type { WorkingListTemplate } from '../workingListsBase.types';

type DataResponse = {
    programStageWorkingLists?: WorkingListTemplate[];
};

export const useProgramStageTemplates = (programId: string | undefined) => {
    const { error, isInitialLoading, data } = useApiDataQuery<DataResponse>(
        ['programStageWorkingLists', programId],
        {
            resource: 'programStageWorkingLists',
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
        programStageTemplates: data?.programStageWorkingLists || [],
    };
};
