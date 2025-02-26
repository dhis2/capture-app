// @flow
import { useMemo, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useEventTemplates = (programId: string) => {
    const { error, loading, data, refetch } = useDataQuery(
        useMemo(
            () => ({
                templates: {
                    resource: 'eventFilters',
                    params: ({ variables }) => ({
                        filter: `program:eq:${variables.programId}`,
                        fields: `
                            id,displayName,eventQueryCriteria,access,externalAccess,publicAccess,
                            user[id,username],
                            userAccesses[id,access],
                            userGroupAccesses[id,access]
                        `,
                    }),
                },
            }),
            [],
        ),
        { lazy: true },
    );

    useEffect(() => {
        programId && refetch({ variables: { programId } });
    }, [refetch, programId]);

    return {
        error,
        loading,
        eventTemplates: data?.templates?.eventFilters ? data.templates.eventFilters : [],
    };
};
