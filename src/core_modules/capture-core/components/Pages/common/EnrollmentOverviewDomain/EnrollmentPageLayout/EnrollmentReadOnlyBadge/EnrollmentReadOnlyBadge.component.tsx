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
    } = useEnrollmentAccessContext();

    if (isEventPage) {
        if (currentStageWriteAccess) return null;
        return (
            <ReadOnlyBadge
                programStageWriteAccess={false}
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
