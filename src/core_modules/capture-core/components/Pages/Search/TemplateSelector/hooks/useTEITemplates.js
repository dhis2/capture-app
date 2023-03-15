// @flow
import { useMemo, useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useTEITemplates = (programId: string) => {
    const [TEITemplates, setTEITemplates] = useState([]);
    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                templates: {
                    resource: 'trackedEntityInstanceFilters',
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
        data?.templates?.trackedEntityInstanceFilters && setTEITemplates(data.templates.trackedEntityInstanceFilters);
    }, [data]);

    useEffect(() => {
        refetch({ variables: { programId } });
    }, [refetch, programId]);

    return {
        error,
        loading,
        TEITemplates,
    };
};
