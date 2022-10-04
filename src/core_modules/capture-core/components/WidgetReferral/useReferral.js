// @flow
import { useEffect, useMemo, useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { referralStatus } from './constants';

export const useReferral = (programStageId: string) => {
    const [currentReferralStatus, setReferralStatus] = useState();
    const [selectedRelationshipTypes, setSelectedRelationshipTypes] = useState([]);

    const { data: programStageData } = useDataQuery(useMemo(() => ({
        programStageReferral: {
            resource: 'programStages',
            id: programStageId,
            params: {
                fields:
                ['referral'],
            },
        },
    }), [programStageId]));

    const { data: relationshipTypeData } = useDataQuery({
        relationshipTypes: {
            resource: 'relationshipTypes',
            params: {
                fields: 'id,access[*],referral,fromConstraint[*],toConstraint[*]',
            },
        },
    });

    useEffect(() => {
        if (relationshipTypeData?.relationshipTypes?.relationshipTypes) {
            const referrableRelationshipTypes = relationshipTypeData.relationshipTypes.relationshipTypes
                .filter(relationshipType => relationshipType.referral && relationshipType.access.data.write);

            setSelectedRelationshipTypes(referrableRelationshipTypes);
        }
    }, [relationshipTypeData]);

    useEffect(() => {
        if (selectedRelationshipTypes.length === 1) {
            const { fromConstraint, toConstraint } = selectedRelationshipTypes[0];

            if ((fromConstraint?.programStage?.id === programStageId
                || toConstraint?.programStage?.id === programStageId)
                && programStageData?.programStageReferral?.referral
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
        programStageData,
    ]);


    return {
        currentReferralStatus,
        selectedRelationshipTypes,
    };
};
