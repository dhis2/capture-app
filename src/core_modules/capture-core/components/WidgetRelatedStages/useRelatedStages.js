// @flow
import { useMemo } from 'react';
import { relatedStageStatus } from './constants';
import { getUserStorageController, userStores } from '../../storageControllers';
import { useIndexedDBQuery } from '../../utils/reactQueryHelpers';
import { RELATIONSHIP_ENTITIES } from './WidgetRelatedStages.constants';
import type { RelationshipType } from './WidgetRelatedStages.types';

const getRelationshipTypeFromIndexedDB = () => {
    const storageController = getUserStorageController();
    return storageController.getAll(userStores.RELATIONSHIP_TYPES);
};

type Props = {|
    programStageId: string,
    programId: string,
|};

const filterBidirectionalRelationship = (): boolean => true;

const filterUnidirectionalRelationship = (relationshipType: RelationshipType, programStageId: string): boolean => {
    const { fromConstraint, toConstraint } = relationshipType;

    const isSelfReferencing = fromConstraint.programStage.id === programStageId
        && toConstraint.programStage.id === programStageId;

    if (fromConstraint.programStage.id !== programStageId && !isSelfReferencing) {
        return false;
    }

    return true;
};
export const useRelatedStages = ({ programStageId, programId }: Props) => {
    const { data: relationshipTypes } = useIndexedDBQuery(
        ['RelatedStages', 'relationshipTypes', programId, programStageId],
        () => getRelationshipTypeFromIndexedDB(), {
            select: (allRelationshipTypes: Array<RelationshipType>) => allRelationshipTypes
                ?.filter((relationshipType) => {
                    if (!relationshipType.access.data.write) {
                        return false;
                    }
                    const { fromConstraint, toConstraint, bidirectional } = relationshipType;

                    // Related stages should be of type program stage
                    if (fromConstraint.relationshipEntity !== RELATIONSHIP_ENTITIES.PROGRAM_STAGE_INSTANCE
                        || toConstraint.relationshipEntity !== RELATIONSHIP_ENTITIES.PROGRAM_STAGE_INSTANCE) {
                        return false;
                    }

                    // Either the from or to side should be the current stage
                    if (fromConstraint.programStage.id !== programStageId
                        && toConstraint.programStage.id !== programStageId) {
                        return false;
                    }

                    // Related stages should only be able to refer to stages in the same program
                    if (fromConstraint.programStage.program.id !== programId
                        || toConstraint.programStage.program.id !== programId) {
                        return false;
                    }

                    return bidirectional ?
                        filterBidirectionalRelationship() :
                        filterUnidirectionalRelationship(relationshipType, programStageId);
                }) ?? [],
        });

    const currentRelatedStagesStatus = useMemo(() => {
        if (relationshipTypes) {
            if (relationshipTypes.length === 1) {
                return relatedStageStatus.LINKABLE;
            } else if (relationshipTypes.length > 1) {
                return relatedStageStatus.AMBIGUOUS_RELATIONSHIPS;
            }
        }
        return null;
    }, [relationshipTypes]);

    const selectedRelationshipType = currentRelatedStagesStatus === relatedStageStatus.LINKABLE ?
        relationshipTypes?.[0] : undefined;
    const constraint = selectedRelationshipType?.toConstraint?.programStage?.id === programStageId ?
        selectedRelationshipType?.fromConstraint : selectedRelationshipType?.toConstraint;


    return {
        currentRelatedStagesStatus,
        selectedRelationshipType,
        constraint,
    };
};
