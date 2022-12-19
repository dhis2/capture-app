// @flow
import { useEffect, useState, useCallback } from 'react';
import { referralStatus } from './constants';
import { getUserStorageController } from '../../storageControllers';
import { userStores } from '../../storageControllers/stores';

export const useReferral = (programStageId: string) => {
    const [currentReferralStatus, setReferralStatus] = useState();
    const [selectedRelationshipTypes, setSelectedRelationshipTypes] = useState([]);

    const getRelationshipTypeFromIndexedDB = useCallback(async () => {
        const storageController = getUserStorageController();
        const allRelationshipTypes = await storageController.getAll(userStores.RELATIONSHIP_TYPES);
        const referrableRelationshipTypes = allRelationshipTypes
            .filter(relationshipType => relationshipType.referral && relationshipType.access.data.write);

        setSelectedRelationshipTypes(referrableRelationshipTypes);
    }, []);

    useEffect(() => {
        getRelationshipTypeFromIndexedDB();
    }, [getRelationshipTypeFromIndexedDB]);

    useEffect(() => {
        if (selectedRelationshipTypes.length === 1) {
            const { fromConstraint, toConstraint } = selectedRelationshipTypes[0];

            if ((fromConstraint?.programStage?.id === programStageId
                || toConstraint?.programStage?.id === programStageId)
            ) {
                setReferralStatus(referralStatus.REFERRABLE);
            }
        } else if (selectedRelationshipTypes.length > 1) {
            setReferralStatus(referralStatus.AMBIGUOUS_REFERRALS);
        }
    }, [
        setSelectedRelationshipTypes,
        selectedRelationshipTypes,
        setReferralStatus,
        programStageId,
    ]);


    return {
        currentReferralStatus,
        selectedRelationshipTypes,
    };
};
