import { useMemo, useEffect } from 'react';
import { useFeature, FEATURES } from 'capture-core-utils';
import { useDataQuery } from '@dhis2/app-runtime';
import type { WorkingListTemplate } from '../workingListsBase.types';

type DataResponse = {
    templates?: {
        programStageWorkingLists?: WorkingListTemplate[];
    };
};

export const useProgramStageTemplates = (programId: string) => {
    const supportsStoreProgramStageWorkingList = useFeature(FEATURES.storeProgramStageWorkingList);
    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                templates: {
                    resource: 'programStageWorkingLists',
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
        supportsStoreProgramStageWorkingList && refetch();
    }, [refetch, programId, supportsStoreProgramStageWorkingList]);

    return {
        error,
        loading,
        programStageTemplates: (data as DataResponse)?.templates?.programStageWorkingLists || [],
    };
};
