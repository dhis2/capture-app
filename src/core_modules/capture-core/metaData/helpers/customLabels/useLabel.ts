import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { programCollection, trackedEntityTypesCollection } from '../../../metaDataMemoryStores';
import { resolveLabel } from './customLabels';
import type { CustomLabelKey, LabelOptions } from './customLabels';

type ProgramOptions = LabelOptions & { programId?: string };
type StageOptions = LabelOptions & { programId?: string, stageId?: string };
type TrackedEntityTypeOptions = LabelOptions & { tetId?: string };

export const useProgramLabel = (key: CustomLabelKey, { programId, plural }: ProgramOptions = {}): string | undefined => {
    const currentProgramId = useSelector(({ currentSelections }: any) => currentSelections.programId);
    const id = programId ?? currentProgramId;
    return useMemo(
        () => resolveLabel(id ? programCollection.get(id)?.customLabels : undefined, key, { plural }),
        [id, key, plural],
    );
};

export const useStageLabel = (key: CustomLabelKey, { programId, stageId, plural }: StageOptions = {}): string | undefined => {
    const currentProgramId = useSelector(({ currentSelections }: any) => currentSelections.programId);
    const currentStageId = useSelector(({ currentSelections }: any) => currentSelections.stageId);
    const pId = programId ?? currentProgramId;
    const sId = stageId ?? currentStageId;
    return useMemo(() => {
        const program = pId ? programCollection.get(pId) : undefined;
        const stage = program && sId ? program.getStage(sId) : undefined;
        return resolveLabel([stage?.customLabels, program?.customLabels], key, { plural });
    }, [pId, sId, key, plural]);
};

export const useTrackedEntityTypeLabel = (
    key: CustomLabelKey,
    { tetId, plural }: TrackedEntityTypeOptions = {},
): string | undefined => {
    const currentTetId = useSelector(({ currentSelections }: any) => currentSelections.trackedEntityTypeId);
    const id = tetId ?? currentTetId;
    return useMemo(
        () => resolveLabel(id ? trackedEntityTypesCollection.get(id)?.customLabels : undefined, key, { plural }),
        [id, key, plural],
    );
};
