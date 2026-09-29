import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ProgramStage } from '../../../metaData';
import type { RelatedStagesEvents } from '../RelatedStagesActions/RelatedStagesActions.types';
import { countNonSkippedEvents } from '../../../events/countNonSkippedEvents';

export const useCanAddNewEventToStage = (programStage?: ProgramStage, existingRelatedEvents: RelatedStagesEvents[] = []) => {
    const hiddenProgramStages = useSelector((state: any) =>
        state.rulesEffectsHiddenProgramStage?.['enrollmentEvent-newEvent'],
    );

    return useMemo(() => {
        const isProgramStageHidden = programStage?.id && hiddenProgramStages?.[programStage.id];

        if (isProgramStageHidden) { return false; }

        return programStage && existingRelatedEvents
            ? programStage.repeatable || (!programStage.repeatable && countNonSkippedEvents(existingRelatedEvents) === 0)
            : false;
    }, [programStage, existingRelatedEvents, hiddenProgramStages]);
};
