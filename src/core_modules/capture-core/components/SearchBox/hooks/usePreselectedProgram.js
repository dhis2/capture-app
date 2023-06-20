// @flow

import { useMemo } from 'react';
import { useTrackedEntityTypesWithCorrelatedPrograms } from '../../../hooks';

export const usePreselectedProgram = (currentSelectionsId: string): ?string => {
    const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();

    return useMemo(() => {
        const { programId } =
            Object.values(trackedEntityTypesWithCorrelatedPrograms)
                // $FlowFixMe https://github.com/facebook/flow/issues/2221
                .map(({ programs }) =>
                    programs.find(({ programId: currentProgramId }) => currentProgramId === currentSelectionsId),
                )
                .filter(program => program)[0] || {};

        return programId;
    }, [currentSelectionsId, trackedEntityTypesWithCorrelatedPrograms]);
};
