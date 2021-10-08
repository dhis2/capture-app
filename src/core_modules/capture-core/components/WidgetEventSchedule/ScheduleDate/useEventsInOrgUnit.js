// @flow
import { useMemo } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useEventsInOrgUnit = (orgUnitId: string) => {
    const { data, error, loading } = useDataQuery(useMemo(() => ({
        events: {
            resource: `events?orgUnit=${orgUnitId}`,
        },
    }), [orgUnitId]));


    return { error, events: !loading && data.events ? data.events.events : [] };
};
