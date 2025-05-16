import { useMemo, useEffect } from 'react';
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import { useDataQuery } from '@dhis2/app-runtime';
import { featureAvailable, FEATURES } from 'capture-core-utils';

type EventsQueryResult = {
    events: any;
};

export const useEventsInOrgUnit = (
    orgUnitId: string,
    selectedDate: string,
    programId: string,
) => {
    const { data, error, loading, refetch } = useDataQuery<EventsQueryResult>(useMemo(() => {
        const orgUnitModeQueryParam: string = featureAvailable(FEATURES.newOrgUnitModeQueryParam)
            ? 'orgUnitMode'
            : 'ouMode';
        const newPagingQueryParam = featureAvailable(FEATURES.newPagingQueryParam)
            ? { paging: false }
            : { skipPaging: true };

        return {
            events: {
                resource: 'tracker/events',
                params: {
                    orgUnit: orgUnitId,
                    program: programId,
                    scheduledAfter: selectedDate,
                    scheduledBefore: selectedDate,
                    ...newPagingQueryParam,
                    status: 'SCHEDULE',
                    [orgUnitModeQueryParam]: 'SELECTED',
                    fields: 'scheduledAt',
                },
            },
        };
    }, [orgUnitId, selectedDate, programId]), { lazy: true });

    useEffect(() => {
        if (orgUnitId && selectedDate && programId) {
            refetch();
        }
    }, [refetch, orgUnitId, selectedDate, programId]);

    const apiEvents = handleAPIResponse(REQUESTED_ENTITIES.events, data?.events);
    return {
        error,
        loading,
        events: !loading && data ? apiEvents : [],
    };
};
