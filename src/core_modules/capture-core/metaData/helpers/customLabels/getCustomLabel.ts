import { getDefaultLabel } from './labels.const';
import type { LabelKey } from './labels.const';
import type { Program } from '../../Program/Program';
import type { ProgramStage } from '../../Program/ProgramStage';
import type { TrackedEntityType } from '../../TrackedEntityType/TrackedEntityType';

type Options = { lowercase?: boolean, plural?: boolean };

/**
 * Resolves the configurable terminology label for a program-level term, falling
 * back to the translated default when no custom label is configured.
 */
export const getProgramLabel = (program: Program | undefined | null, key: LabelKey, options?: Options): string =>
    program?.customLabels[key] ?? getDefaultLabel(key, options);

/**
 * Resolves a term that can be overridden at both stage and program level.
 * Precedence: stage label → program label → translated default.
 */
export const getStageLabel = (
    stage: ProgramStage | undefined | null,
    program: Program | undefined | null,
    key: LabelKey,
    options?: Options,
): string =>
    stage?.customLabels[key] ?? program?.customLabels[key] ?? getDefaultLabel(key, options);

export const getTrackedEntityTypeLabel = (
    trackedEntityType: TrackedEntityType | undefined | null,
    key: LabelKey,
    options?: Options,
): string =>
    trackedEntityType?.customLabels[key] ?? getDefaultLabel(key, options);
