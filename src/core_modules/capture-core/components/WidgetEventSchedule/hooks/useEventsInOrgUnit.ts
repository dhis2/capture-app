import { useMemo, useEffect } from 'react';
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import { useDataQuery } from '@dhis2/app-runtime';

export const useEventsInOrgUnit = (
    orgUnitId: string,
    selectedDate: string,
    programId: string,
) => {
    const { data, error, loading, refetch } = useDataQuery(
        useMemo(
            () => ({
                events: {
                    resource: 'tracker/events',
                    params: ({ variables: { orgUnitId: ouId, selectedDate: date, programId: pId } }: any) => ({
                        orgUnit: ouId,
                        program: pId,
                        scheduledAfter: date,
                        scheduledBefore: date,
                        paging: false,
                        status: 'SCHEDULE',
                        orgUnitMode: 'SELECTED',
                        fields: 'scheduledAt',
                    }),
                },
            }),
            [],
        ),
        { lazy: true },
    );

    useEffect(() => {
        if (orgUnitId && selectedDate && programId) {
            refetch({ variables: { orgUnitId, selectedDate, programId } });
        }
    }, [refetch, orgUnitId, selectedDate, programId]);

    const apiEvents = handleAPIResponse(REQUESTED_ENTITIES.events, data?.events);
    return {
        error,
        loading,
        events: !loading && data ? apiEvents : [],
    };
};
