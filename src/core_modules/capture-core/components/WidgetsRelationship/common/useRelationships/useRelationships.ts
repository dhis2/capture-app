import { useMemo } from 'react';
import { handleAPIResponse, REQUESTED_ENTITIES } from 'capture-core/utils/api';
import { featureAvailable, FEATURES } from 'capture-core-utils';
import { determineLinkedEntity } from
    'capture-core/components/WidgetsRelationship/common/RelationshipsWidget/useGroupedLinkedEntities';
import { useApiDataQuery } from '../../../../utils/reactQueryHelpers';
import type { InputRelationshipData, RelationshipTypes } from '../Types';

export const RelationshipSearchEntities = Object.freeze({
    TRACKED_ENTITY: 'trackedEntity',
    ENROLLMENT: 'enrollment',
    EVENT: 'event',
});

type Props = {
    entityId: string;
    searchMode: typeof RelationshipSearchEntities[keyof typeof RelationshipSearchEntities];
    relationshipTypes: RelationshipTypes | null;
};

type ReturnData = Array<InputRelationshipData>;

export const useRelationships = ({ entityId, searchMode, relationshipTypes }: Props) => {
    const query = useMemo(() => {
        const supportForFeature = featureAvailable(FEATURES.newPagingQueryParam);

        return {
            resource: 'tracker/relationships',
            params: {
                [searchMode]: entityId,
                fields: `relationship,relationshipType,createdAt,
                    from[trackedEntity[trackedEntity,attributes,program,orgUnit,trackedEntityType],
                    event[event,dataValues,program,orgUnit,orgUnitName,status,createdAt]],
                    to[trackedEntity[trackedEntity,attributes,program,orgUnit,trackedEntityType],
                    event[event,dataValues,program,orgUnit,orgUnitName,status,createdAt]]`,
                ...(supportForFeature
                    ? { paging: false }
                    : { skipPaging: true }),
            },
        };
    }, [entityId, searchMode]);

    return useApiDataQuery(
        ['relationships', entityId],
        query,
        {
            enabled: !!entityId,
            select: (apiResponse: any): ReturnData => {
                const apiRelationships = handleAPIResponse(REQUESTED_ENTITIES.relationships, apiResponse);
                if (!relationshipTypes?.length || !apiRelationships?.length) {
                    return [];
                }

                return apiRelationships.reduce((acc: ReturnData, relationship: any) => {
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
