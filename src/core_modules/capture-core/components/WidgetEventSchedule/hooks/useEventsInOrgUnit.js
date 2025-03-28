// @flow
import { useMemo, useEffect } from 'react';
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import { useDataQuery } from '@dhis2/app-runtime';
import { featureAvailable, FEATURES } from 'capture-core-utils';

export const useEventsInOrgUnit = (orgUnitId: string, selectedDate: string) => {
    const { data, error, loading, refetch } = useDataQuery(
        useMemo(
            () => {
                const orgUnitModeQueryParam: string = featureAvailable(FEATURES.newOrgUnitModeQueryParam)
                    ? 'orgUnitMode'
                    : 'ouMode';
                const newPagingQueryParam = featureAvailable(FEATURES.newPagingQueryParam)
                    ? { paging: false }
                    : { skipPaging: true };

                return {
                    events: {
                        resource: 'tracker/events',
                        params: ({ variables: { orgUnitId: id, selectedDate: date } }) => ({
                            orgUnit: id,
                            scheduledAfter: date,
                            scheduledBefore: date,
                            ...newPagingQueryParam,
                            status: 'SCHEDULE',
                            [orgUnitModeQueryParam]: 'SELECTED',
                            fields: 'scheduledAt',
                        }),
                    },
                };
            },
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
