// @flow
import { useMemo } from 'react';
import { convertDateObjectToDateFormatString } from '../../../utils/converters/date';
import type { LinkableEvent } from '../ReferralActions/ReferralActions.types';
import { useApiDataQuery } from '../../../utils/reactQueryHelpers';

type Props = {
    stageId: ?string,
    teiId: string,
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
    teiId,
    relationshipTypeId,
    scheduledLabel,
    occurredLabel,
    enabled = true,
}: Props): ReturnType => {
    const query = useMemo(() => ({
        resource: 'tracker/events',
        params: {
            programStage: stageId,
            trackedEntity: teiId,
            fields: 'event,occurredAt,scheduledAt,relationships',
        },
    }), [stageId, teiId]);
    const { data, isLoading, isError } = useApiDataQuery<Array<LinkableEvent>>(
        ['availableReferralEvents', stageId, teiId, relationshipTypeId],
        query,
        {
            enabled: !!stageId && enabled,
            cacheTime: 0,
            staleTime: 0,
            select: (response: any) => {
                const events = response?.instances;
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
