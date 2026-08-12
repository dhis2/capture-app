import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { programCollection } from '../../../metaDataMemoryStores';
import { resolveLabel } from './customLabels';
import type { CustomLabelKey, LabelOptions } from './customLabels';

type ProgramOptions = LabelOptions & { programId?: string };
type StageOptions = LabelOptions & { programId?: string, stageId?: string };

export const useProgramLabel = (key: CustomLabelKey, { programId, plural }: ProgramOptions = {}): string | undefined => {
    const currentProgramId = useSelector(({ currentSelections }: any) => currentSelections.programId);
    const id = programId ?? currentProgramId;
    return useMemo(
        () => resolveLabel(id ? programCollection.get(id)?.customLabels : undefined, key, { plural }),
        [id, key, plural],
    );
};

export const useStageLabel = (
    key: CustomLabelKey,
    { programId, stageId, plural }: StageOptions = {},
): string | undefined => {
    const currentProgramId = useSelector(({ currentSelections }: any) => currentSelections.programId);
    const pId = programId ?? currentProgramId;
    return useMemo(() => {
        const program = pId ? programCollection.get(pId) : undefined;
        const stage = program && stageId ? program.getStage(stageId) : undefined;
        return resolveLabel([stage?.customLabels, program?.customLabels], key, { plural });
    }, [pId, stageId, key, plural]);
};
