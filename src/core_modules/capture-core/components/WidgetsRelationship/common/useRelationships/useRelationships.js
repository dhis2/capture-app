// @flow
import { useMemo } from 'react';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import type { InputRelationshipData, RelationshipTypes } from '../Types';
import { determineLinkedEntity } from '../RelationshipsWidget/useGroupedLinkedEntities';

export const RelationshipSearchEntities = Object.freeze({
    TRACKED_ENTITY: 'trackedEntity',
    ENROLLMENT: 'enrollment',
    EVENT: 'event',
});

type Props = {|
    entityId: string,
    searchMode: $Values<typeof RelationshipSearchEntities>,
    relationshipTypes: ?RelationshipTypes,
|}

type ReturnData = Array<InputRelationshipData>;

export const useRelationships = ({ entityId, searchMode, relationshipTypes }: Props) => {
    const query = useMemo(() => ({
        resource: 'tracker/relationships',
        params: {
            // $FlowFixMe - searchMode should be a valid key of RelationshipSearchEntities
            [searchMode]: entityId,
            fields: 'relationshipType,createdAt,from[trackedEntity[trackedEntity,attributes,program,orgUnit,trackedEntityType],event[event,dataValues,program,orgUnit,orgUnitName,status,createdAt]],to[trackedEntity[trackedEntity,attributes,program,orgUnit,trackedEntityType],event[event,dataValues,program,orgUnit,orgUnitName,status,createdAt]]',
        },
    }), [entityId, searchMode]);

    return useApiDataQuery<ReturnData>(
        ['relationships', entityId],
        query,
        {
            enabled: !!entityId,
            select: ({ instances }: any) => {
                if (!relationshipTypes?.length || !instances?.length) {
                    return [];
                }

                return instances.reduce((acc, relationship) => {
                    const relationshipType = relationshipTypes
                        .find(relType => relType.id === relationship.relationshipType);
                    if (!relationshipType) {
                        return acc;
                    }
                    const { from, to } = relationship;
                    const apiLinkedEntity = determineLinkedEntity(from, to, entityId);

                    if (!apiLinkedEntity) {
                        return acc;
                    }

                    if (!relationshipType.bidirectional && apiLinkedEntity === from) {
                        return acc;
                    }

                    acc.push(relationship);
                    return acc;
                }, []);
            },
        },
    );
};
