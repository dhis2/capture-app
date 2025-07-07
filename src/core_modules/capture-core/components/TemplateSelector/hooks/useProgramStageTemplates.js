// @flow
import { useMemo, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useProgramStageTemplates = (programId: string) => {
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
        refetch({ variables: { programId } });
    }, [refetch, programId]);

    return {
        error,
        loading,
        programStageTemplates: data?.templates?.programStageWorkingLists
            ? data.templates.programStageWorkingLists
            : [],
    };
};
