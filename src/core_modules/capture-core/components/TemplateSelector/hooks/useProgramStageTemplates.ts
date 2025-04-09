import { useEffect } from 'react';
import { useFeature, FEATURES } from 'capture-core-utils';
import { useDataQuery } from '@dhis2/app-runtime';
import type { WorkingListTemplate } from '../workingListsBase.types';

type DataResponse = {
    templates?: {
        programStageWorkingLists?: WorkingListTemplate[];
    };
};

export const useProgramStageTemplates = (programId: string | undefined) => {
    const supportsStoreProgramStageWorkingList = useFeature(FEATURES.storeProgramStageWorkingList);
    const { error, loading, data, refetch } = useDataQuery({
        templates: {
            resource: 'programStageWorkingLists',
            params: {
                filter: programId ? `program.id:eq:${programId}` : '',
                fields: 'id,displayName,access,sortOrder',
            },
        },
    }, { lazy: true });

    useEffect(() => {
        if (programId && supportsStoreProgramStageWorkingList) {
            refetch();
        }
    }, [refetch, programId, supportsStoreProgramStageWorkingList]);

    return {
        error,
        loading,
        programStageTemplates: (data as DataResponse)?.templates?.programStageWorkingLists || [],
    };
};
