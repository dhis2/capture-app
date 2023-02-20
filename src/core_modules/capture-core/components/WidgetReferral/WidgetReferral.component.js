// @flow
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useReferral } from './useReferral';
import type { Props } from './widgetReferral.types';
import { ReferralActions } from './ReferralActions';
import type { ReferralDataValueStates } from '../WidgetEnrollmentEventNew/Validated/validated.types';
import { actions as ReferralModes, referralStatus } from './constants';
import {
    getConvertedReferralEvent,
    referralWidgetIsValid,
} from '../WidgetEnrollmentEventNew/Validated/getConvertedReferralEvent';
import { useLocationQuery } from '../../utils/routing';
import { useScheduledLabel } from './hooks/useScheduledLabel';
import type { ErrorMessagesForReferral } from './ReferralActions/ReferralActions.types';

const WidgetReferralPlain = ({ programStageId, ...passOnProps }: Props, ref) => {
    const { programId, teiId, enrollmentId } = useLocationQuery();
    const { currentReferralStatus, selectedRelationshipType, constraint } = useReferral(programStageId);
    const [saveAttempted, setSaveAttempted] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const { scheduledLabel } = useScheduledLabel(constraint?.programStage?.id);
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

    const formIsValid = () => {
        const { scheduledAt, orgUnit } = referralDataValues;
        return referralWidgetIsValid({
            scheduledAt,
            orgUnit,
            setErrorMessages: addErrorMessage,
        });
    };

    const getReferralValues = (eventId: string) => {
        const { referralEvent, relationship } = getConvertedReferralEvent({
            referralDataValues,
            currentProgramStageId: programStageId,
            currentEventId: eventId,
            programId,
            teiId,
            enrollmentId,
            // $FlowFixMe - selectedRelationshipType is not null
            referralType: selectedRelationshipType,
        });

        return {
            referralEvent,
            relationship,
        };
    };

    // useImperativeHandler for exposing functions to ref
    useImperativeHandle(ref, () => ({
        eventHasReferralRelationship,
        formIsValidOnSave,
        getReferralValues,
    }));

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
            {...passOnProps}
        />
    );
};

export const WidgetReferral = forwardRef<Props, {|
    eventHasReferralRelationship: Function,
    formIsValidOnSave: Function,
    getReferralValues: Function
|}>(WidgetReferralPlain);
