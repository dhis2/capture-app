// @flow
import { useMemo } from 'react';
import { convertDateObjectToDateFormatString } from '../../../utils/converters/date';
import type { RelatedStagesEvents } from '../RelatedStagesActions/RelatedStagesActions.types';
import { useApiDataQuery } from '../../../utils/reactQueryHelpers';
import { handleAPIResponse, REQUESTED_ENTITIES } from '../../../utils/api';

type Props = {
    stageId: ?string,
    enrollmentId: ?string,
    scheduledLabel: string,
    occurredLabel: string,
    relationshipTypeId: ?string,
    enabled?: boolean,
}

type ReturnType = {
    events: Array<RelatedStagesEvents>,
    linkableEvents: Array<RelatedStagesEvents>,
    isLoading: boolean,
    isError: boolean,
}

export const useRelatedStageEvents = ({
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
    const { data, isLoading, isError } = useApiDataQuery<Array<RelatedStagesEvents>>(
        ['availableRelatedStageEvents', stageId, enrollmentId, relationshipTypeId],
        query,
        {
            enabled: !!stageId && !!enrollmentId && enabled,
            cacheTime: 0,
            staleTime: 0,
            select: (response: any) => {
                const events = handleAPIResponse(REQUESTED_ENTITIES.events, response);
                if (events.length === 0) return [];

                return events
                    .map((event) => {
                        const isLinkable = !event.relationships
                            ?.some(relationship => relationship.relationshipType === relationshipTypeId);
                        const label = event.occurredAt
                            ? `${occurredLabel}: ${convertDateObjectToDateFormatString(new Date(event.occurredAt))}`
                            : `${scheduledLabel}: ${convertDateObjectToDateFormatString(new Date(event.scheduledAt))}`;

                        return ({
                            id: event.event,
                            status: event.status,
                            isLinkable,
                            label,
                        });
                    });
            },
        },
    );

    return {
        events: data ?? [],
        linkableEvents: data?.filter(event => event.isLinkable) ?? [],
        isLoading,
        isError,
    };
};
