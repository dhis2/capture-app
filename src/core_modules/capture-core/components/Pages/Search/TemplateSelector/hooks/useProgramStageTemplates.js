// @flow
import { useMemo, useState, useEffect } from 'react';
import { useFeature, FEATURES } from 'capture-core-utils';
import { useDataQuery } from '@dhis2/app-runtime';

export const useProgramStageTemplates = (programId: string) => {
    const supportsStoreProgramStageWorkingList = useFeature(FEATURES.storeProgramStageWorkingList);
    const [programStageTemplates, setProgramStageTemplates] = useState([]);
    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                templates: {
                    resource: 'programStageWorkingLists',
                    params: ({ variables }) => ({
                        filter: `program.id:eq:${variables.programId}`,
                        fields: 'id,displayName,access,sortOrder',
                    }),
                },
            }),
            [],
        ),
        { lazy: true },
    );

    useEffect(() => {
        data?.templates?.programStageWorkingLists && setProgramStageTemplates(data.templates.programStageWorkingLists);
    }, [data]);

    useEffect(() => {
        supportsStoreProgramStageWorkingList && refetch({ variables: { programId } });
    }, [refetch, programId, supportsStoreProgramStageWorkingList]);

    return {
        error,
        loading,
        programStageTemplates,
    };
};
