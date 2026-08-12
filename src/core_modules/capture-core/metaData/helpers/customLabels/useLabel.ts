import i18n from '@dhis2/d2-i18n';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { programCollection } from '../../../metaDataMemoryStores';
import { resolveLabel } from './customLabels';
import type { CustomLabelKey, LabelOptions } from './customLabels';

const defaults: Record<CustomLabelKey, () => string> = {
    enrollment: () => i18n.t('enrollment'),
    event: () => i18n.t('event'),
    programStage: () => i18n.t('program stage'),
    note: () => i18n.t('note'),
    relationship: () => i18n.t('relationship'),
    attribute: () => i18n.t('attribute'),
    orgUnit: () => i18n.t('organisation unit'),
    followUp: () => i18n.t('follow-up'),
};

type TermLabelOptions = LabelOptions & { stageId?: string };

const resolve = (
    programId: string | undefined,
    key: CustomLabelKey,
    { stageId, plural }: TermLabelOptions,
): string => {
    const program = programId ? programCollection.get(programId) : undefined;
    const stage = program && stageId ? program.getStage(stageId) : undefined;
    return resolveLabel([stage?.customLabels, program?.customLabels], key, { plural })
        ?? defaults[key]();
};

/**
 * Works anywhere — components, reducers, epics.
 * Returns the custom label from the program (or stage), falling back to the
 * translated default term.
 */
export const getTermLabel = (
    programId: string | undefined,
    key: CustomLabelKey,
    options: TermLabelOptions = {},
): string => resolve(programId, key, options);

/**
 * React hook version — reads programId from Redux automatically.
 * Pass programId explicitly to override (e.g. cross-program widgets).
 */
export const useTermLabel = (
    key: CustomLabelKey,
    options: TermLabelOptions & { programId?: string } = {},
): string => {
    const { programId, stageId, plural } = options;
    const currentProgramId = useSelector(({ currentSelections }: any) => currentSelections.programId);
    const id = programId ?? currentProgramId;
    return useMemo(() => resolve(id, key, { stageId, plural }), [id, key, stageId, plural]);
};
