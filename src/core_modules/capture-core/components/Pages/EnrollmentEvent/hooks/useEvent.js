// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useEvent = (eventId: string) => {
    const { error, loading, data } = useDataQuery(
        useMemo(
            () => ({
                event: {
                    resource: `events/${eventId}`,
                },
            }),
            [eventId],
        ),
    );
    return { error, event: !loading && data?.event };
};
