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
        isEventWithinValidPeriod,
        canEditCompletedEvent,
        isWithinCompleteEventsExpiry,
    } = useEnrollmentAccessContext();

    if (isEventPage) {
        return (
            <ReadOnlyBadge
                programStageWriteAccess={currentStageWriteAccess}
                eventWithinValidPeriod={isEventWithinValidPeriod}
                canEditCompletedEvent={canEditCompletedEvent}
                withinCompleteEventsExpiry={isWithinCompleteEventsExpiry}
                trackedEntityName={trackedEntityTypeName}
                inlineLabel
            />
        );
    }

    const stagesEffectivelyReadOnly = !anyStageWriteAccess && anyStageReadAccess;
    const showAllMissing = !programWriteAccess && !trackedEntityTypeWriteAccess && stagesEffectivelyReadOnly;
    if (!showAllMissing) return null;

    return (
        <ReadOnlyBadge
            programWriteAccess={false}
            trackedEntityTypeWriteAccess={false}
            programStageWriteAccess={false}
            trackedEntityName={trackedEntityTypeName}
            inlineLabel
        />
    );
};
