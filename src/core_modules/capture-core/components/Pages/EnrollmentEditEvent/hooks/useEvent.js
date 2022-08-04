// @flow
import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

export const useEvent = (eventId: string) => {
    const [event, setEvent] = useState({
        program: undefined,
        programStage: undefined,
        enrollment: undefined,
        trackedEntity: undefined,
    });
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

    const {
        data: dataFallback,
        refetch,
        called,
    } = useDataQuery(
        useMemo(
            () => ({
                enrollment: {
                    resource: 'tracker/enrollments',
                    id: ({ variables: { enrollment } }) => enrollment,
                    params: {
                        fields: ['trackedEntity'],
                    },
                },
            }),
            [],
        ),
        { lazy: true },
    );

    useEffect(() => {
        if (data?.event) {
            setEvent(data.event);

            // fallback for the case when the endpoint tracker/events does not return the trackedEntity field.
            if (data.event.enrollment && data.event.trackedEntity === undefined && !called) {
                refetch({ variables: { enrollment: data.event.enrollment } });
            }
        }
    }, [data?.event, refetch, called]);

    useEffect(() => {
        if (dataFallback?.enrollment?.trackedEntity) {
            setEvent(e => ({ ...e, trackedEntity: dataFallback?.enrollment?.trackedEntity }));
        }
    }, [dataFallback?.enrollment]);

    return {
        error,
        loading,
        event: !loading && data ? event : undefined,
    };
};
