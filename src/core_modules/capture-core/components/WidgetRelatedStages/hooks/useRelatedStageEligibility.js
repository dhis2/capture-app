import { useMemo } from 'react';

export const useRelatedStageEligibility = (programStage, existingRelatedEvents) => useMemo(() =>
    (programStage && existingRelatedEvents
        ? programStage.repeatable || (!programStage.repeatable && existingRelatedEvents.length === 0)
        : false),
[programStage, existingRelatedEvents],
);
