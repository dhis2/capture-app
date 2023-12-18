// @flow
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useReferral } from './useReferral';
import type { Props, ReferralDataValueStates } from './WidgetReferral.types';
import { ReferralActions } from './ReferralActions';
import { actions as ReferralModes, referralStatus } from './constants';
import { useStageLabels } from './hooks/useStageLabels';
import type { ErrorMessagesForReferral } from './ReferralActions';
import { referralWidgetIsValid } from './referralEventIsValid/referralEventIsValid';
import { useAvailableReferralEvents } from './hooks/useAvailableReferralEvents';

const WidgetReferralPlain = ({
    programId,
    enrollmentId,
    programStageId,
    currentStageLabel,
    ...passOnProps
}: Props, ref) => {
    const { currentReferralStatus, selectedRelationshipType, constraint } = useReferral(programStageId);
    const { scheduledLabel, occurredLabel } = useStageLabels(programId, constraint?.programStage?.id);
    const { linkableEvents, isLoading: isLoadingEvents } = useAvailableReferralEvents({
        stageId: constraint?.programStage?.id,
        relationshipTypeId: selectedRelationshipType?.id,
        scheduledLabel,
        occurredLabel,
        enrollmentId,
    });
    const [saveAttempted, setSaveAttempted] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [referralDataValues, setReferralDataValues] = useState<ReferralDataValueStates>({
        referralMode: ReferralModes.REFER_ORG,
        scheduledAt: '',
        orgUnit: undefined,
        linkedEventId: undefined,
    });

    const addErrorMessage = (message: ErrorMessagesForReferral) => {
        setErrorMessages((prevMessages: Object) => ({
            ...prevMessages,
            ...message,
        }));
    };

    const eventHasReferralRelationship = () => currentReferralStatus === referralStatus.REFERRABLE;

    const formIsValidOnSave = () => {
        setSaveAttempted(true);
        return formIsValid();
    };

    const formIsValid = useCallback(() => {
        const { scheduledAt, orgUnit, linkedEventId, referralMode } = referralDataValues;
        return referralWidgetIsValid({
            referralMode,
            scheduledAt,
            orgUnit,
            linkedEventId,
            setErrorMessages: addErrorMessage,
        });
    }, [referralDataValues]);

    const getReferralValues = () => ({
        referralMode: referralDataValues.referralMode,
        referralValues: referralDataValues,
        referralType: selectedRelationshipType,
    });

    // useImperativeHandler for exposing functions to ref
    useImperativeHandle(ref, () => ({
        eventHasReferralRelationship,
        formIsValidOnSave,
        getReferralValues,
    }));

    useEffect(() => {
        if (referralDataValues) {
            formIsValid();
        }
    }, [formIsValid, referralDataValues]);

    if (!currentReferralStatus || !selectedRelationshipType || isLoadingEvents) {
        return null;
    }

    return (
        <ReferralActions
            scheduledLabel={scheduledLabel}
            type={currentReferralStatus}
            linkableEvents={linkableEvents}
            referralDataValues={referralDataValues}
            setReferralDataValues={setReferralDataValues}
            addErrorMessage={addErrorMessage}
            saveAttempted={saveAttempted}
            errorMessages={errorMessages}
            constraint={constraint}
            currentStageLabel={currentStageLabel}
            {...passOnProps}
        />
    );
};

export const WidgetReferral = forwardRef<Props, {|
    eventHasReferralRelationship: Function,
    formIsValidOnSave: Function,
    getReferralValues: Function
|}>(WidgetReferralPlain);
