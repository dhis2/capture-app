// @flow
import { useMemo } from 'react';
import { useApiDataQuery } from '../../../utils/reactQueryHelpers';

type Props = {|
    originEventId: string,
    skipBidirectionalChecks?: boolean,
|};

const calculateRelatedStageRelationships = (event, skipBidirectionalChecks) => {
    if (!event || !event.relationships || event.relationships.length === 0) {
        return null;
    }

    const stageToStageRelationships = event.relationships.filter(({ to, from }) => {
        if (!to.event || !from.event) {
            return null;
        }
        return to.event.program === from.event.program;
    });

    if (stageToStageRelationships.length !== 1) {
        return null;
    }

    const stageToStageRelationship = stageToStageRelationships[0];
    const eventIsOrigin = stageToStageRelationship.from.event.event === event.event;

    if (!skipBidirectionalChecks && eventIsOrigin && !stageToStageRelationship.bidirectional) {
        return null;
    }

    const linkedEvent = eventIsOrigin ? stageToStageRelationship.to.event : stageToStageRelationship.from.event;

    return {
        relationshipType: stageToStageRelationship.relationshipType,
        relationshipId: stageToStageRelationship.relationship,
        linkedEvent,
    };
};

export const useLinkedEventByOriginId = ({ originEventId, skipBidirectionalChecks }: Props) => {
    const eventByIdQuery = useMemo(() => ({
        resource: 'tracker/events',
        id: originEventId,
        params: {
            fields: 'event,relationships[relationship,relationshipType,relationshipName,bidirectional,' +
                        'from[event[event,dataValues,occurredAt,scheduledAt,status,orgUnit,programStage,program]],' +
                        'to[event[event,dataValues,*,occurredAt,scheduledAt,status,orgUnit,programStage,program]]' +
                    ']',
        },
    }), [originEventId]);

    const { data, isLoading, isError, error } = useApiDataQuery(
        ['linkedEventByOriginEvent', originEventId],
        eventByIdQuery,
        {
            enabled: !!originEventId,
            cacheTime: 0,
            staleTime: 4000,
        },
    );

    const { linkedEvent, relationship, relationshipType, dataValues } = useMemo(() => {
        if (!data) return {};

        const relatedStageRelationship = calculateRelatedStageRelationships(data, skipBidirectionalChecks);
        if (!relatedStageRelationship) return {};

        return {
            linkedEvent: relatedStageRelationship.linkedEvent,
            relationship: relatedStageRelationship.relationshipId,
            relationshipType: relatedStageRelationship.relationshipType,
            dataValues: relatedStageRelationship.linkedEvent.dataValues,
        };
    }, [data, skipBidirectionalChecks]);

    const { data: fallbackDataValues, isLoading: isLoadingFallback } = useApiDataQuery(
        ['linkedEventDataValuesFallback', linkedEvent?.event],
        {
            resource: 'tracker/events',
            id: linkedEvent?.event,
            params: {
                fields: 'event,dataValues,occurredAt,scheduledAt,status,orgUnit,programStage,program',
            },
        },
        { enabled: !!linkedEvent?.event && !dataValues },
    );

    return {
        linkedEvent: dataValues ? linkedEvent : fallbackDataValues,
        relationship,
        relationshipType,
        dataValues: dataValues || fallbackDataValues?.dataValues,
        isLoading: isLoading || isLoadingFallback,
        isError,
        error,
    };
};
