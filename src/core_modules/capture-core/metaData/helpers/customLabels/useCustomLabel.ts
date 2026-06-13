import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { programCollection, trackedEntityTypesCollection } from '../../../metaDataMemoryStores';
import { getProgramLabel, getStageLabel, getTrackedEntityTypeLabel } from './getCustomLabel';
import type { LabelKey } from './labels.const';

type Options = { lowercase?: boolean, plural?: boolean };

/**
 * Resolves a program-level configurable terminology label. Defaults to the
 * currently selected program when no programId is passed.
 */
export const useProgramLabel = (key: LabelKey, programIdInput?: string, options?: Options): string => {
    const currentProgramId = useSelector(({ currentSelections }: any) => currentSelections.programId);
    const programId = programIdInput ?? currentProgramId;
    const lowercase = options?.lowercase;
    const plural = options?.plural;
    return useMemo(
        () => getProgramLabel(programId ? programCollection.get(programId) : undefined, key, { lowercase, plural }),
        [programId, key, lowercase, plural],
    );
};

/**
 * Resolves a term that can be overridden at both stage and program level
 * (stage label → program label → default). Defaults to the currently selected
 * program/stage when ids are not passed.
 */
export const useStageLabel = (
    key: LabelKey,
    stageIdInput?: string,
    programIdInput?: string,
    options?: Options,
): string => {
    const currentProgramId = useSelector(({ currentSelections }: any) => currentSelections.programId);
    const currentStageId = useSelector(({ currentSelections }: any) => currentSelections.stageId);
    const programId = programIdInput ?? currentProgramId;
    const stageId = stageIdInput ?? currentStageId;
    const lowercase = options?.lowercase;
    const plural = options?.plural;
    return useMemo(() => {
        const program = programId ? programCollection.get(programId) : undefined;
        const stage = program && stageId ? program.getStage(stageId) : undefined;
        return getStageLabel(stage, program, key, { lowercase, plural });
    }, [programId, stageId, key, lowercase, plural]);
};

/**
 * Resolves a tracked-entity-type-level configurable terminology label. Defaults
 * to the currently selected tracked entity type when no id is passed.
 */
export const useTrackedEntityTypeLabel = (key: LabelKey, tetIdInput?: string, options?: Options): string => {
    const currentTetId = useSelector(({ currentSelections }: any) => currentSelections.trackedEntityTypeId);
    const tetId = tetIdInput ?? currentTetId;
    const lowercase = options?.lowercase;
    const plural = options?.plural;
    return useMemo(
        () => getTrackedEntityTypeLabel(
            tetId ? trackedEntityTypesCollection.get(tetId) : undefined, key, { lowercase, plural }),
        [tetId, key, lowercase, plural],
    );
};
