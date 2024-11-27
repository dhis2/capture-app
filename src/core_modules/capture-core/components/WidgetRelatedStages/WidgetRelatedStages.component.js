// @flow
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useRelatedStages } from './useRelatedStages';
import { useOrgUnitAutoSelect } from '../../dataQueries';
import type { Props, RelatedStageDataValueStates } from './WidgetRelatedStages.types';
import type { ErrorMessagesForRelatedStages } from './RelatedStagesActions';
import { RelatedStagesActions } from './RelatedStagesActions';
import { relatedStageStatus } from './constants';
import { useStageLabels } from './hooks/useStageLabels';
import { relatedStageWidgetIsValid } from './relatedStageEventIsValid/relatedStageEventIsValid';
import { useRelatedStageEvents } from './hooks/useRelatedStageEvents';

const WidgetRelatedStagesPlain = ({
    programId,
    enrollmentId,
    programStageId,
    ...passOnProps
}: Props, ref) => {
    const { currentRelatedStagesStatus, selectedRelationshipType, constraint } = useRelatedStages({
        programStageId,
        programId,
    });
    const { scheduledLabel, occurredLabel } = useStageLabels(programId, constraint?.programStage?.id);
    const { events, linkableEvents, isLoading: isLoadingEvents } = useRelatedStageEvents({
        stageId: constraint?.programStage?.id,
        relationshipTypeId: selectedRelationshipType?.id,
        scheduledLabel,
        occurredLabel,
        enrollmentId,
    });
    const [saveAttempted, setSaveAttempted] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [relatedStageDataValues, setRelatedStageDataValues] = useState<RelatedStageDataValueStates>({
        linkMode: undefined,
        scheduledAt: '',
        orgUnit: undefined,
        linkedEventId: undefined,
    });
    const { isLoading: orgUnitLoading, data } = useOrgUnitAutoSelect();
    useEffect(() => {
        if (!orgUnitLoading && data?.length === 1) {
            setRelatedStageDataValues(prev => ({
                ...prev,
                orgUnit: data[0],
            }));
        }
    }, [data, orgUnitLoading, setRelatedStageDataValues]);

    const addErrorMessage = (message: ErrorMessagesForRelatedStages) => {
        setErrorMessages((prevMessages: Object) => ({
            ...prevMessages,
            ...message,
        }));
    };

    const eventHasLinkableStageRelationship = () => currentRelatedStagesStatus === relatedStageStatus.LINKABLE;

    const formIsValidOnSave = () => {
        setSaveAttempted(true);
        return formIsValid();
    };

    const formIsValid = useCallback(() => {
        const { scheduledAt, orgUnit, linkedEventId, linkMode } = relatedStageDataValues;
        return relatedStageWidgetIsValid({
            linkMode,
            scheduledAt,
            orgUnit,
            linkedEventId,
            setErrorMessages: addErrorMessage,
        });
    }, [relatedStageDataValues]);

    const getLinkedStageValues = () => ({
        linkMode: relatedStageDataValues.linkMode,
        relatedStageDataValues,
        selectedRelationshipType,
    });

    // useImperativeHandler for exposing functions to ref
    useImperativeHandle(ref, () => ({
        eventHasLinkableStageRelationship,
        formIsValidOnSave,
        getLinkedStageValues,
    }));

    useEffect(() => {
        if (relatedStageDataValues) {
            formIsValid();
        }
    }, [formIsValid, relatedStageDataValues]);

    if (!currentRelatedStagesStatus || !selectedRelationshipType || isLoadingEvents || orgUnitLoading) {
        return null;
    }

    return (
        <RelatedStagesActions
            relationshipName={selectedRelationshipType.displayName}
            scheduledLabel={scheduledLabel}
            type={currentRelatedStagesStatus}
            events={events}
            linkableEvents={linkableEvents}
            relatedStagesDataValues={relatedStageDataValues}
            setRelatedStagesDataValues={setRelatedStageDataValues}
            addErrorMessage={addErrorMessage}
            saveAttempted={saveAttempted}
            errorMessages={errorMessages}
            constraint={constraint}
            {...passOnProps}
        />
    );
};

export const WidgetRelatedStages = forwardRef < Props, {|
    eventHasLinkableStageRelationship: Function,
        formIsValidOnSave: Function,
            getLinkedStageValues: Function
                |}>(WidgetRelatedStagesPlain);
