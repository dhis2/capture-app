// @flow
import { useMemo } from 'react';
import { relatedStageStatus } from './constants';
import { getUserStorageController } from '../../storageControllers';
import { userStores } from '../../storageControllers/stores';
import { useIndexedDBQuery } from '../../utils/reactQueryHelpers';
import { RELATIONSHIP_ENTITIES } from './WidgetRelatedStages.constants';

const getRelationshipTypeFromIndexedDB = () => {
    const storageController = getUserStorageController();
    return storageController.getAll(userStores.RELATIONSHIP_TYPES);
};

type Props = {|
    programStageId: string,
    programId: string,
|}

export const useRelatedStages = ({ programStageId, programId }: Props) => {
    const { data: relationshipTypes } = useIndexedDBQuery(
        ['RelatedStages', 'relationshipTypes', programId, programStageId],
        () => getRelationshipTypeFromIndexedDB(), {
            select: allRelationshipTypes => allRelationshipTypes
                ?.filter((relationshipType) => {
                    if (!relationshipType.access.data.write) {
                        return false;
                    }

                    const { fromConstraint, toConstraint } = relationshipType;

                    // Related stages should be of type program stage
                    if (fromConstraint.relationshipEntity !== RELATIONSHIP_ENTITIES.PROGRAM_STAGE_INSTANCE
                        || toConstraint.relationshipEntity !== RELATIONSHIP_ENTITIES.PROGRAM_STAGE_INSTANCE) {
                        return false;
                    }

                    // Related stages should not be able to refer to itself
                    if (fromConstraint.programStage.id === programStageId
                        && toConstraint.programStage.id === programStageId) {
                        return false;
                    }

                    // Related stages should only be able to refer to stages in the same program
                    if (fromConstraint.programStage.program?.id !== programId
                        || toConstraint.programStage.program?.id !== programId) {
                        return false;
                    }

                    // If the stage is unidirectional and the current stage is the to side, it should not be included
                    if (relationshipType.bidirectional === false
                        && toConstraint.programStage.id === programStageId) {
                        return false;
                    }

                    return true;
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
