// @flow
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ProgramStage } from '../../../metaData';
import type { LinkableEvent } from '../RelatedStagesActions/RelatedStagesActions.types';

export const useCanAddNewEventToStage = (programStage: ?ProgramStage, existingRelatedEvents: LinkableEvent[]) => {
    const hiddenProgramStages = useSelector(({ rulesEffectsHiddenProgramStageDesc }) =>
        rulesEffectsHiddenProgramStageDesc?.['enrollmentEvent-newEvent'],
    );

    return useMemo(() => {
        const isProgramStageHidden = hiddenProgramStages?.[programStage?.id];

        if (isProgramStageHidden) { return false; }

        return programStage && existingRelatedEvents
            ? programStage.repeatable || (!programStage.repeatable && existingRelatedEvents.length === 0)
            : false;
    }, [programStage, existingRelatedEvents, hiddenProgramStages]);
};
