// @flow
import React, { useEffect, useRef } from 'react';
import { useReferral } from './useReferral';
import type { Props } from './widgetReferral.types';
import { ReferralActions } from './ReferralActions';

export const WidgetReferral = ({ programStageId, onSelectReferralType, ...passOnProps }: Props) => {
    const { currentReferralStatus, selectedRelationshipType } = useReferral(programStageId);
    const referralTypeRef = useRef(null);

    useEffect(() => {
        // only trigger the callback if the referral type has changed
        if (referralTypeRef.current !== selectedRelationshipType) {
            referralTypeRef.current = selectedRelationshipType;
            onSelectReferralType(selectedRelationshipType);
        }
    }, [onSelectReferralType, selectedRelationshipType]);

    if (!currentReferralStatus || !selectedRelationshipType) {
        return null;
    }

    return (
        <ReferralActions
            selectedType={selectedRelationshipType}
            type={currentReferralStatus}
            {...passOnProps}
        />
    );
};
