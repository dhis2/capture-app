// @flow
import { useMemo, useEffect } from 'react';
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import { useDataQuery } from '@dhis2/app-runtime';
import { featureAvailable, FEATURES } from 'capture-core-utils';

export const useEventsInOrgUnit = (orgUnitId: string) => {
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
                        params: ({ variables: { orgUnitId: id } }) => ({
                            orgUnit: id,
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
        if (orgUnitId) {
            refetch({ variables: { orgUnitId } });
        }
    }, [refetch, orgUnitId]);

    const apiEvents = handleAPIResponse(REQUESTED_ENTITIES.events, data?.events);
    return { error, events: !loading && data ? apiEvents : [] };
};
