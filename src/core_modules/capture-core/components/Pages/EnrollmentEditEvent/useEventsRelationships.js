// @flow
import { useMemo, useEffect } from 'react';
// $FlowFixMe
import { useSelector, useDispatch } from 'react-redux';
import { useDataQuery } from '@dhis2/app-runtime';
import { setEventRelationshipsData } from '../Enrollment/EnrollmentPage.actions';

export const useEventsRelationships = (eventId: string) => {
    const dispatch = useDispatch();

    const {
        eventId: storedEventId,
        relationships: storedRelationships,
    } = useSelector(({ enrollmentPage }) => enrollmentPage);

    const {
        data,
        error,
        refetch,
    } = useDataQuery(
        useMemo(
            () => ({
                eventRelationships: {
                    resource: 'tracker/relationships',
                    params: ({ variables: { eventId: updatedEventId } }) => ({
                        event: updatedEventId,
                        fields: ['relationshipType,to,from,createdAt'],
                    }),
                },
            }),
            [],
        ),
        { lazy: true },
    );

    const fetchedEventData = {
        reference: data,
        eventId,
        relationships: data?.eventRelationships?.instances,
    };

    useEffect(() => {
        if (fetchedEventData.reference) {
            dispatch(setEventRelationshipsData(
                fetchedEventData.eventId,
                fetchedEventData.relationships,
            ));
        }
    }, [
        dispatch,
        fetchedEventData.reference,
        fetchedEventData.relationships,
        fetchedEventData.eventId,
    ]);

    useEffect(() => {
        if (storedEventId !== eventId) {
            refetch({ variables: { eventId } });
        }
    }, [storedEventId, eventId, refetch]);

    return { relationships: storedRelationships, error };
};
