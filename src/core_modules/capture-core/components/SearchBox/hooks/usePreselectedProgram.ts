import { useMemo } from 'react';
import { useTrackedEntityTypesWithCorrelatedPrograms } from '../../../hooks';

export const usePreselectedProgram = (currentSelectionsId: string): string | null | undefined => {
    const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();

    return useMemo(() => {
        const { programId } =
            Object.values(trackedEntityTypesWithCorrelatedPrograms)
                .map((item: any) => {
                    const { programs } = item;
                    return programs.find(({ programId: currentProgramId }: any) => currentProgramId === currentSelectionsId);
                })
                .filter(program => program)[0] || {};

        return programId;
    }, [currentSelectionsId, trackedEntityTypesWithCorrelatedPrograms]);
};
