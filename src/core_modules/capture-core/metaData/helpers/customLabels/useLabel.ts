import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { programCollection, trackedEntityTypesCollection } from '../../../metaDataMemoryStores';
import { resolveLabel } from './customLabels';
import type { TermKey, LabelOptions } from './customLabels';

type ProgramOptions = LabelOptions & { programId?: string };
type StageOptions = LabelOptions & { programId?: string, stageId?: string };
type TrackedEntityTypeOptions = LabelOptions & { tetId?: string };

/** Resolves a program-level term; defaults to the currently selected program. */
export const useProgramLabel = (key: TermKey, { programId, plural }: ProgramOptions = {}): string => {
    const currentProgramId = useSelector(({ currentSelections }: any) => currentSelections.programId);
    const id = programId ?? currentProgramId;
    return useMemo(
        () => resolveLabel(id ? programCollection.get(id)?.customLabels : undefined, key, { plural }),
        [id, key, plural],
    );
};

/** Resolves a term with stage → program fallback; defaults to the current program/stage. */
export const useStageLabel = (key: TermKey, { programId, stageId, plural }: StageOptions = {}): string => {
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

/** Resolves a tracked-entity-type-level term; defaults to the current tracked entity type. */
export const useTrackedEntityTypeLabel = (key: TermKey, { tetId, plural }: TrackedEntityTypeOptions = {}): string => {
    const currentTetId = useSelector(({ currentSelections }: any) => currentSelections.trackedEntityTypeId);
    const id = tetId ?? currentTetId;
    return useMemo(
        () => resolveLabel(id ? trackedEntityTypesCollection.get(id)?.customLabels : undefined, key, { plural }),
        [id, key, plural],
    );
};
