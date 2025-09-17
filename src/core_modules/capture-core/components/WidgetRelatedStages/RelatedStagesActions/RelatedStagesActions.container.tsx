import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useOrgUnitAutoSelect } from '../../../dataQueries';
import type { RelatedStageDataValueStates } from '../WidgetRelatedStages.types';
import type { Props, ErrorMessagesForRelatedStages } from './RelatedStagesActions.types';
import { RelatedStagesActions as RelatedStagesActionsComponent } from './RelatedStagesActions.component';
import { relatedStageStatus, relatedStageActions } from '../constants';
import { useStageLabels, useRelatedStageEvents, useRelatedStages } from '../hooks';
import { relatedStageWidgetIsValid } from '../relatedStageEventIsValid/relatedStageEventIsValid';
import { useProgramExpiryForUser } from '../../../hooks';

type RefHandle = {
    eventHasLinkableStageRelationship: () => boolean;
    formIsValidOnSave: () => boolean;
    getLinkedStageValues: () => {
        linkMode?: keyof typeof relatedStageActions;
        relatedStageDataValues: RelatedStageDataValueStates;
        selectedRelationshipType: any;
    };
};

const RelatedStagesActionsPlain = ({
    programId,
    enrollmentId,
    programStageId,
    isLinking,
    onLink,
    ...passOnProps
}: Props, ref) => {
    const { currentRelatedStagesStatus, selectedRelationshipType, constraint } = useRelatedStages({
        programStageId,
        programId,
    });
    const { scheduledLabel, occurredLabel } = useStageLabels(programId, constraint?.programStage?.id);
    const { events, linkableEvents, isLoading: isLoadingEvents } = useRelatedStageEvents({
        programId,
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
        scheduledAtFormatError: undefined,
        orgUnit: undefined,
        linkedEventId: undefined,
    });
    const { isLoading: orgUnitLoading, data } = useOrgUnitAutoSelect();
    const expiryPeriod = useProgramExpiryForUser(programId);

    useEffect(() => {
        if (!orgUnitLoading && (data as any)?.length === 1) {
            setRelatedStageDataValues(prev => ({
                ...prev,
                orgUnit: (data as any)[0],
            }));
        }
    }, [data, orgUnitLoading, setRelatedStageDataValues]);

    const addErrorMessage = (message: ErrorMessagesForRelatedStages) => {
        setErrorMessages(prevMessages => ({
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
        const { scheduledAt, scheduledAtFormatError, orgUnit, linkedEventId, linkMode } = relatedStageDataValues;
        return relatedStageWidgetIsValid({
            linkMode,
            scheduledAt,
            scheduledAtFormatError,
            orgUnit,
            linkedEventId,
            expiryPeriod,
            setErrorMessages: addErrorMessage,
        });
    }, [relatedStageDataValues, expiryPeriod]);

    const getLinkedStageValues = () => ({
        linkMode: relatedStageDataValues.linkMode,
        relatedStageDataValues,
        selectedRelationshipType,
    });

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
        <RelatedStagesActionsComponent
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
            isLinking={isLinking}
            constraint={constraint}
            onLink={onLink}
            {...passOnProps}
        />
    );
};

export const RelatedStagesActions = forwardRef<RefHandle, Props>(RelatedStagesActionsPlain);
