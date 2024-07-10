// @flow
import { useMemo } from 'react';
import { useApiDataQuery } from '../../../utils/reactQueryHelpers';

type Props = {|
    originEventId: string,
|}

const formatDataValues = (dataValues: Array<{ dataElement: string, value: any }>) => {
    if (!dataValues || dataValues.length === 0) {
        return {};
    }

    return dataValues.reduce((acc, { dataElement, value }) => {
        acc[dataElement] = value;
        return acc;
    }, {});
}

const calculateRelatedStageRelationships = (event) => {
    if (!event || !event.relationships || event.relationships.length === 0) {
        return false;
    }

    const stageToStageRelationships = event.relationships.filter(({ to, from }) => {
        if (!to.event || !from.event) {
            return false;
        }
        return to.event.program === from.event.program;
    });

    if (stageToStageRelationships.length !== 1) {
        return false;
    }

    const stageToStageRelationship = stageToStageRelationships[0];
    const eventIsOrigin = stageToStageRelationship.from.event.event === event.event;

    if (eventIsOrigin && !stageToStageRelationship.bidirectional) {
        return false;
    }

    const linkedEvent = eventIsOrigin ? stageToStageRelationship.to.event : stageToStageRelationship.from.event;

    return {
        relationshipType: stageToStageRelationship.relationshipType,
        linkedEvent,
    }
}

export const useLinkedEventByOriginId = ({ originEventId }: Props) => {
    const eventByIdQuery = useMemo(() => ({
        resource: 'tracker/events',
        id: originEventId,
        params: {
            fields: 'event,relationships[relationshipType,relationshipName,bidirectional,' +
                        'from[event[event,dataValues,occurredAt,scheduledAt,status,orgUnit,programStage,program]],' +
                        'to[event[event,dataValues,*,occurredAt,scheduledAt,status,orgUnit,programStage,program]]' +
                    ']'
        }
    }), [originEventId]);

    const { data, isLoading, isError, error } = useApiDataQuery(
        ['linkedEventByOriginEvent', originEventId],
        eventByIdQuery,
        {
            enabled: !!originEventId,
            cacheTime: 0,
            staleTime: 4000,
        }
    );

    const { linkedEvent, relationshipType, dataValues } = useMemo(() => {
        if (!data) {
            return {};
        }

        const relatedStageRelationship = calculateRelatedStageRelationships(data);
        if (!relatedStageRelationship) {
            return {};
        }
        const { linkedEvent, relationshipType } = relatedStageRelationship;

        return {
            linkedEvent,
            relationshipType,
            dataValues: formatDataValues(linkedEvent.dataValues),
        };
    }, [data]);

    return {
        linkedEvent,
        relationshipType,
        dataValues,
        isLoading,
        isError,
        error
    }
}
