// @flow
import { useMemo, useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useTEIFilters = (programId: string) => {
    const [TEIFilters, setTEIFilters] = useState([]);
    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                filters: {
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
        data?.filters?.trackedEntityInstanceFilters && setTEIFilters(data.filters.trackedEntityInstanceFilters);
    }, [data]);

    useEffect(() => {
        refetch({ variables: { programId } });
    }, [refetch, programId]);

    return {
        error,
        loading,
        TEIFilters,
    };
};
