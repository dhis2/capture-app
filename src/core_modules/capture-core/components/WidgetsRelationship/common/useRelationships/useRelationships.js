// @flow
import { useMemo } from 'react';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import type { InputRelationshipData } from '../Types';

export const RelationshipSearchEntities = Object.freeze({
    TRACKED_ENTITY: 'trackedEntity',
    ENROLLMENT: 'enrollment',
    EVENT: 'event',
});

type ReturnData = Array<InputRelationshipData>;

export const useRelationships = (entityId: string, searchMode: string) => {
    const query = useMemo(() => ({
        resource: 'tracker/relationships',
        params: {
            [searchMode]: entityId,
            fields: 'relationshipType,createdAt,from[trackedEntity[trackedEntity,attributes,program,orgUnit,trackedEntityType],event[event,dataValues,program,orgUnit,orgUnitName,status,createdAt]],to[trackedEntity[trackedEntity,attributes,program,orgUnit,trackedEntityType],event[event,dataValues,program,orgUnit,orgUnitName,status,createdAt]]',
        },
    }), [entityId, searchMode]);

    return useApiDataQuery<ReturnData>(
        ['relationships', entityId],
        query,
        {
            enabled: !!entityId,
            select: ({ instances }: any) => instances,
        },
    );
};
