// @flow
import { useMemo, useEffect } from 'react';
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import { useDataQuery } from '@dhis2/app-runtime';

export const useEventsInOrgUnit = (orgUnitId: string, selectedDate: string) => {
    const { data, error, loading, refetch } = useDataQuery(
        useMemo(
            () => ({
                events: {
                    resource: 'tracker/events',
                    params: ({ variables: { orgUnitId: id, selectedDate: date } }) => ({
                        orgUnit: id,
                        occurredAfter: date,
                        occurredBefore: date,
                        skipPaging: true,
                        status: 'SCHEDULE',
                        ouMode: 'SELECTED',
                        fields: 'scheduledAt',
                    }),
                },
            }),
            [],
        ),
        { lazy: true },
    );


    useEffect(() => {
        if (orgUnitId && selectedDate) {
            refetch({ variables: { orgUnitId, selectedDate } });
        }
    }, [refetch, orgUnitId, selectedDate]);

    const apiEvents = handleAPIResponse(REQUESTED_ENTITIES.events, data?.events);
    return { error, events: !loading && data ? apiEvents : [] };
};
