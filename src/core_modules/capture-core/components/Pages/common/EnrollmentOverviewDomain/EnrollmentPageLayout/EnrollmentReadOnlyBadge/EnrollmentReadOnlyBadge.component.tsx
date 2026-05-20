import React from 'react';
import { ReadOnlyBadge } from '../../../../../ReadOnlyBadge';
import { useEnrollmentAccessContext } from '../../EnrollmentAccessContext';

export const EnrollmentReadOnlyBadge = () => {
    const {
        isEventPage,
        currentStageWriteAccess,
        programWriteAccess,
        trackedEntityTypeWriteAccess,
        anyStageWriteAccess,
        anyStageReadAccess,
        trackedEntityTypeName,
        trackedEntityInactive,
        multipleStages,
        isEventWithinValidPeriod,
        canEditCompletedEvent,
    } = useEnrollmentAccessContext();

    if (trackedEntityInactive) {
        return (
            <ReadOnlyBadge
                trackedEntityName={trackedEntityTypeName}
                trackedEntityInactive
                inlineLabel
            />
        );
    }

    if (isEventPage) {
        return (
            <ReadOnlyBadge
                programStageWriteAccess={currentStageWriteAccess}
                eventWithinValidPeriod={isEventWithinValidPeriod}
                canEditCompletedEvent={canEditCompletedEvent}
                trackedEntityName={trackedEntityTypeName}
                multipleStages={multipleStages}
                inlineLabel
            />
        );
    }

    const stagesEffectivelyReadOnly = !anyStageWriteAccess && anyStageReadAccess;
    const showAllMissing = !programWriteAccess && !trackedEntityTypeWriteAccess && stagesEffectivelyReadOnly;
    if (!showAllMissing) return null;

    return (
        <ReadOnlyBadge
            inlineLabel
            trackedEntityName={trackedEntityTypeName}
            programWriteAccess={programWriteAccess}
            trackedEntityTypeWriteAccess={trackedEntityTypeWriteAccess}
            anyStageWriteAccess={anyStageWriteAccess}
            anyStageReadAccess={anyStageReadAccess}
        />
    );
};
