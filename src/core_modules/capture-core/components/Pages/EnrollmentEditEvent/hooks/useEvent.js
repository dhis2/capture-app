// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useEvent = (eventId: string) => {
    const { data, error, loading } = useDataQuery(
        useMemo(
            () => ({
                event: {
                    resource: 'tracker/events',
                    id: eventId,
                    params: {
                        fields: ['program', 'programStage', 'enrollment', 'trackedEntity'],
                    },
                },
            }),
            [eventId],
        ),
    );

    return {
        error,
        loading,
        event: !loading && data ? data.event : undefined,
    };
};
