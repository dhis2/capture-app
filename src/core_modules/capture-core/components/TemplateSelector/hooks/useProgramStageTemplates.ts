import { useFeature, FEATURES } from 'capture-core-utils';
import { useApiDataQuery } from 'capture-core/utils/reactQueryHelpers';
import type { WorkingListTemplate } from '../workingListsBase.types';

type DataResponse = {
    programStageWorkingLists?: WorkingListTemplate[];
};

export const useProgramStageTemplates = (programId: string | undefined) => {
    const supportsStoreProgramStageWorkingList = useFeature(FEATURES.storeProgramStageWorkingList);
    const { error, isLoading, data } = useApiDataQuery<DataResponse>(
        ['programStageWorkingLists', programId],
        {
            resource: 'programStageWorkingLists',
            params: {
                filter: `program.id:eq:${programId}`,
                fields: 'id,displayName,access,sortOrder',
            },
        },
        {
            enabled: !!programId && supportsStoreProgramStageWorkingList,
        },
    );

    return {
        error,
        loading: isLoading,
        programStageTemplates: data?.programStageWorkingLists || [],
    };
};
