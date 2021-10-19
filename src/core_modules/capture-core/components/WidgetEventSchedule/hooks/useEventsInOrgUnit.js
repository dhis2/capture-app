// @flow
import { useMemo, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useEventsInOrgUnit = (orgUnitId: string, selectedDate: string) => {
    const { data, error, loading, refetch } = useDataQuery(
        useMemo(
            () => ({
                events: {
                    resource: 'events',
                    params: ({ variables: { orgUnitId: id, selectedDate: date } }) => ({
                        orgUnit: id,
                        startDate: date,
                        endDate: date,
                        skipPaging: true,
                        status: 'SCHEDULE',
                        ouMode: 'SELECTED',
                        fields: 'dueDate',
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
    }, [orgUnitId, selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

    return { error, events: !loading && data ? data.events.events : [] };
};
