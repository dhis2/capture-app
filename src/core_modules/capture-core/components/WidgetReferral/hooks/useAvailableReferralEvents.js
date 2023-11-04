// @flow
import { useMemo } from 'react';
import { convertDateObjectToDateFormatString } from '../../../utils/converters/date';
import type { LinkableEvent } from '../ReferralActions/ReferralActions.types';
import { useApiDataQuery } from '../../../utils/reactQueryHelpers';

type Props = {
    stageId: ?string,
    enrollmentId: string,
    scheduledLabel: string,
    occurredLabel: string,
    relationshipTypeId: ?string,
    enabled?: boolean,
}


type ReturnType = {
    linkableEvents: Array<LinkableEvent>,
    isLoading: boolean,
    isError: boolean,
}

export const useAvailableReferralEvents = ({
    stageId,
    enrollmentId,
    relationshipTypeId,
    scheduledLabel,
    occurredLabel,
    enabled = true,
}: Props): ReturnType => {
    const query = useMemo(() => ({
        resource: 'tracker/events',
        params: {
            programStage: stageId,
            enrollments: enrollmentId,
            fields: 'event,occurredAt,scheduledAt,status,relationships',
        },
    }), [stageId, enrollmentId]);
    const { data, isLoading, isError } = useApiDataQuery<Array<LinkableEvent>>(
        ['availableReferralEvents', stageId, enrollmentId, relationshipTypeId],
        query,
        {
            enabled: !!stageId && enabled,
            cacheTime: 0,
            staleTime: 0,
            select: (response: any) => {
                const events = response?.instances.filter(instance => ['SCHEDULE', 'ACTIVE'].includes(instance.status));

                if (events.length === 0) return [];

                return events.reduce((acc, event) => {
                    if (!event.relationships) return acc;

                    if (event.relationships.length === 0) acc.push(event);

                    const hasRelationship = !event
                        .relationships
                        .some(relationship => relationship.relationshipType === relationshipTypeId);
                    if (!hasRelationship) acc.push(event);

                    return acc;
                }, [])
                    .map((event) => {
                        const label = event.occurredAt
                            ? `${occurredLabel}: ${convertDateObjectToDateFormatString(new Date(event.occurredAt))}`
                            : `${scheduledLabel}: ${convertDateObjectToDateFormatString(new Date(event.scheduledAt))}`;

                        return ({
                            id: event.event,
                            label,
                        });
                    });
            },
        },
    );

    return {
        linkableEvents: data ?? [],
        isLoading,
        isError,
    };
};
