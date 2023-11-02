// @flow
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useReferral } from './useReferral';
import type { Props, ReferralDataValueStates } from './WidgetReferral.types';
import { ReferralActions } from './ReferralActions';
import { actions as ReferralModes, referralStatus } from './constants';
import { useScheduledLabel } from './hooks/useScheduledLabel';
import type { ErrorMessagesForReferral } from './ReferralActions';
import { referralWidgetIsValid } from './referralEventIsValid/referralEventIsValid';

const WidgetReferralPlain = ({ programId, programStageId, currentStageLabel, ...passOnProps }: Props, ref) => {
    const { currentReferralStatus, selectedRelationshipType, constraint } = useReferral(programStageId);
    const [saveAttempted, setSaveAttempted] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const { scheduledLabel } = useScheduledLabel(programId, constraint?.programStage?.id);
    const [referralDataValues, setReferralDataValues] = useState<ReferralDataValueStates>({
        referralMode: ReferralModes.REFER_ORG,
        scheduledAt: '',
        orgUnit: undefined,
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
        const { scheduledAt, orgUnit, referralMode } = referralDataValues;
        return referralWidgetIsValid({
            referralMode,
            scheduledAt,
            orgUnit,
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

    if (!currentReferralStatus || !selectedRelationshipType) {
        return null;
    }

    return (
        <ReferralActions
            scheduledLabel={scheduledLabel}
            selectedType={selectedRelationshipType}
            type={currentReferralStatus}
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
