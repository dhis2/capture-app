import { useEffect, useState } from 'react';

export const useRelatedStageEligibility = (programStage, existingRelatedEvents) => {
    const [isRelatedStageEligible, setIsRelatedStageEligible] = useState(false);

    useEffect(() => {
        if (programStage && existingRelatedEvents) {
            const eligible = programStage.repeatable ||
                (!programStage.repeatable && existingRelatedEvents.length === 0);
            setIsRelatedStageEligible(eligible);
        }
    }, [programStage, existingRelatedEvents]);

    return isRelatedStageEligible;
};
