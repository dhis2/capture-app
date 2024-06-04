import { useMemo } from 'react';

export const useCanAddNewEventToStage = (programStage, existingRelatedEvents) => useMemo(() =>
    (programStage && existingRelatedEvents
        ? programStage.repeatable || (!programStage.repeatable && existingRelatedEvents.length === 0)
        : false),
[programStage, existingRelatedEvents],
);
