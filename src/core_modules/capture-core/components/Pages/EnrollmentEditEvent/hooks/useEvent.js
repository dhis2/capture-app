// @flow
import { useMemo, useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const defaultState = {
    program: undefined,
    programStage: undefined,
    enrollment: undefined,
    trackedEntity: undefined,
};

export const useEvent = (eventId: string) => {
    const [event, setEvent] = useState(defaultState);
    const { data, error, loading, refetch } = useDataQuery(
        useMemo(
            () => ({
                event: {
                    resource: 'tracker/events',
                    id: ({ variables: { id } }) => id,
                    params: {
                        fields: ['program', 'programStage', 'enrollment', 'trackedEntity'],
                    },
                },
            }),
            [],
        ),
    );

    const { data: dataFallback, refetch: refetchFallback } = useDataQuery(
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
        if (eventId) {
            setEvent(defaultState);
            refetch({ variables: { id: eventId } });
        }
    }, [eventId, refetch]);

    useEffect(() => {
        data?.event && setEvent(data.event);
    }, [data?.event]);

    useEffect(() => {
        // fallback for the case when the endpoint tracker/events does not return the trackedEntity field.
        if (event.enrollment && event.trackedEntity === undefined) {
            refetchFallback({ variables: { enrollment: event.enrollment } });
        }
    }, [event.enrollment, event.trackedEntity, refetchFallback]);

    useEffect(() => {
        if (dataFallback?.enrollment?.trackedEntity) {
            setEvent(e => ({ ...e, trackedEntity: dataFallback?.enrollment?.trackedEntity }));
        }
    }, [dataFallback?.enrollment?.trackedEntity]);

    return {
        error,
        loading,
        event: !loading && data ? event : undefined,
    };
};
