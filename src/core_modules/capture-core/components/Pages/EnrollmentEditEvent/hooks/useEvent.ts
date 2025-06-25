import { useEffect, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';

const defaultState = {
    program: '',
    programStage: '',
    enrollment: '',
    trackedEntity: '',
    event: '',
};

const eventQuery = {
    event: {
        resource: 'tracker/events',
        id: ({ variables }: any) => variables.id,
        params: {
            fields: ['program', 'programStage', 'enrollment', 'trackedEntity', 'event'],
        },
    },
};

const enrollmentQuery = {
    enrollment: {
        resource: 'tracker/enrollments',
        id: ({ variables }: any) => variables.enrollment,
        params: {
            fields: ['trackedEntity'],
        },
    },
};

export const useEvent = (eventId: string) => {
    const [event, setEvent] = useState(defaultState);
    const { data, error, refetch } = useDataQuery(eventQuery, { lazy: true });
    const { data: dataFallback, refetch: refetchFallback } = useDataQuery(enrollmentQuery, { lazy: true });

    useEffect(() => {
        if (eventId) {
            setEvent(defaultState);
            refetch({ variables: { id: eventId } });
        }
    }, [eventId, refetch]);

    useEffect(() => {
        data?.event && setEvent(data.event as any);
    }, [data?.event]);

    useEffect(() => {
        if (event.enrollment && event.trackedEntity === undefined) {
            refetchFallback({ variables: { enrollment: event.enrollment } });
        }
    }, [event.enrollment, event.trackedEntity, refetchFallback]);

    useEffect(() => {
        if (dataFallback?.enrollment && (dataFallback.enrollment as any).trackedEntity) {
            setEvent(e => ({ ...e, trackedEntity: (dataFallback.enrollment as any).trackedEntity }));
        }
    }, [dataFallback?.enrollment]);

    return {
        error,
        loading: !eventId || eventId !== event.event || !event.trackedEntity,
        event,
    };
};
