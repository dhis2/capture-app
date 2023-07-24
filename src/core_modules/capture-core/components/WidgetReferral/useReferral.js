// @flow
import { useMemo } from 'react';
import { referralStatus } from './constants';
import { getUserStorageController } from '../../storageControllers';
import { userStores } from '../../storageControllers/stores';
import { useIndexedDBQuery } from '../../utils/reactQueryHelpers';

const getRelationshipTypeFromIndexedDB = () => {
    const storageController = getUserStorageController();
    return storageController.getAll(userStores.RELATIONSHIP_TYPES);
};

export const useReferral = (programStageId: string) => {
    const { data: relationshipTypes } = useIndexedDBQuery('relationshipTypes',
        () => getRelationshipTypeFromIndexedDB(), {
            select: allRelationshipTypes => allRelationshipTypes
                ?.filter(relationshipType => relationshipType.referral && relationshipType.access.data.write) ?? [],
        });

    const currentReferralStatus = useMemo(() => {
        if (relationshipTypes) {
            if (relationshipTypes.length === 1) {
                const { fromConstraint, toConstraint } = relationshipTypes[0];

                if ((fromConstraint?.programStage?.id === programStageId
                    || toConstraint?.programStage?.id === programStageId)
                ) {
                    return referralStatus.REFERRABLE;
                }
            } else if (relationshipTypes.length > 1) {
                return referralStatus.AMBIGUOUS_REFERRALS;
            }
        }
        return null;
    }, [programStageId, relationshipTypes]);

    const selectedRelationshipType = currentReferralStatus === referralStatus.REFERRABLE ?
        relationshipTypes?.[0] : undefined;
    const constraint = selectedRelationshipType?.toConstraint?.programStage?.id === programStageId ?
        selectedRelationshipType?.fromConstraint : selectedRelationshipType?.toConstraint;


    return {
        currentReferralStatus,
        selectedRelationshipType,
        constraint,
    };
};
