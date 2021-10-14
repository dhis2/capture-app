// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useEventsInOrgUnit = (orgUnitId: string) => {
    const { data, error, loading, refetch } = useDataQuery(useMemo(() => ({
        events: {
            resource: `events?orgUnit=${orgUnitId}&fields=eventDate&skipPaging=true`,
        },
    }), [orgUnitId]));


    return { error, events: !loading && data.events ? data.events.events : [], refetch };
};
