import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useCanAddNewEventToStage = (programStage, existingRelatedEvents) => {
    const hiddenProgramStages = useSelector(({ rulesEffectsHiddenProgramStageDesc }) =>
        rulesEffectsHiddenProgramStageDesc?.['enrollmentEvent-newEvent'],
    );

    return useMemo(() => {
        const isProgramStageHidden = hiddenProgramStages?.[programStage.id];

        if (isProgramStageHidden) { return false; }

        return programStage && existingRelatedEvents
            ? programStage.repeatable || (!programStage.repeatable && existingRelatedEvents.length === 0)
            : false;
    }, [programStage, existingRelatedEvents, hiddenProgramStages]);
};
