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
        isEventBlockedByExpiry,
        isFormBlockedByCompletion,
    } = useEnrollmentAccessContext();

    if (isEventPage) {
        return (
            <ReadOnlyBadge
                programStageWriteAccess={currentStageWriteAccess}
                isEventBlockedByExpiry={isEventBlockedByExpiry}
                isFormBlockedByCompletion={isFormBlockedByCompletion}
                trackedEntityName={trackedEntityTypeName}
                trackedEntityInactive={trackedEntityInactive}
                inlineLabel
            />
        );
    }

    const stagesEffectivelyReadOnly = !anyStageWriteAccess && anyStageReadAccess;
    const showAllMissing = !programWriteAccess && !trackedEntityTypeWriteAccess && stagesEffectivelyReadOnly;
    if (!showAllMissing && !trackedEntityInactive) return null;

    return (
        <ReadOnlyBadge
            programWriteAccess={false}
            trackedEntityTypeWriteAccess={false}
            programStageWriteAccess={false}
            trackedEntityName={trackedEntityTypeName}
            trackedEntityInactive={trackedEntityInactive}
            inlineLabel
        />
    );
};
