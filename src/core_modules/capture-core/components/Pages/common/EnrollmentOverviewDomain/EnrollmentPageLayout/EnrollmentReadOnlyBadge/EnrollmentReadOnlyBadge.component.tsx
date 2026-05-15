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
    } = useEnrollmentAccessContext();

    return (
        <ReadOnlyBadge
            inlineLabel
            trackedEntityName={trackedEntityTypeName}
            trackedEntityInactive={trackedEntityInactive}
            isEventPage={isEventPage}
            currentStageWriteAccess={currentStageWriteAccess}
            programWriteAccess={programWriteAccess}
            trackedEntityTypeWriteAccess={trackedEntityTypeWriteAccess}
            anyStageWriteAccess={anyStageWriteAccess}
            anyStageReadAccess={anyStageReadAccess}
            multipleStages={multipleStages}
        />
    );
};
