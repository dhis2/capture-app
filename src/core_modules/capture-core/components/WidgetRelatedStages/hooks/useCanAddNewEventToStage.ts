import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ProgramStage } from '../../../metaData';
import type { RelatedStagesEvents } from '../RelatedStagesActions/RelatedStagesActions.types';

export const useCanAddNewEventToStage = (programStage?: ProgramStage, existingRelatedEvents: RelatedStagesEvents[] = []) => {
    const hiddenProgramStages = useSelector((state: any) =>
        state.rulesEffectsHiddenProgramStageDesc?.['enrollmentEvent-newEvent'],
    );

    return useMemo(() => {
        const isProgramStageHidden = programStage?.id && hiddenProgramStages?.[programStage.id];

        if (isProgramStageHidden) { return false; }

        return programStage && existingRelatedEvents
            ? programStage.repeatable || 
                (!programStage.repeatable && existingRelatedEvents.length === 0)
            : false;
    }, [programStage, existingRelatedEvents, hiddenProgramStages]);
};
