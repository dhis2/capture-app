// @flow
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { referralStatus } from './constants';
import { getUserStorageController } from '../../storageControllers';
import { userStores } from '../../storageControllers/stores';

const getRelationshipTypeFromIndexedDB = () => {
    const storageController = getUserStorageController();
    return storageController.getAll(userStores.RELATIONSHIP_TYPES);
};

export const useReferral = (programStageId: string) => {
    const [currentReferralStatus, setReferralStatus] = useState();

    const { data: relationshipTypes } = useQuery('relationshipTypes', () => getRelationshipTypeFromIndexedDB(), {
        select: allRelationshipTypes => allRelationshipTypes
            ?.filter(relationshipType => relationshipType.referral && relationshipType.access.data.write) ?? [],
    });
    const selectedRelationshipType = currentReferralStatus === referralStatus.REFERRABLE ?
        relationshipTypes?.[0] : undefined;
    const constraint = selectedRelationshipType?.toConstraint?.programStage?.id === programStageId ?
        selectedRelationshipType?.fromConstraint : selectedRelationshipType?.toConstraint;

    useEffect(() => {
        if (relationshipTypes) {
            if (relationshipTypes.length === 1) {
                const { fromConstraint, toConstraint } = relationshipTypes[0];

                if ((fromConstraint?.programStage?.id === programStageId
                    || toConstraint?.programStage?.id === programStageId)
                ) {
                    setReferralStatus(referralStatus.REFERRABLE);
                }
            } else if (relationshipTypes.length > 1) {
                setReferralStatus(referralStatus.AMBIGUOUS_REFERRALS);
            }
        }
    }, [
        relationshipTypes,
        setReferralStatus,
        programStageId,
    ]);

    return {
        currentReferralStatus,
        selectedRelationshipType,
        constraint,
    };
};
