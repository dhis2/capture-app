import i18n from '@dhis2/d2-i18n';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { programCollection } from '../../metaDataMemoryStores';

type LabelConfig = {
    field: string;
    pluralField?: string;
    singular: () => string;
    plural?: () => string;
};

const asLabels = <T extends string>(labels: Record<T, LabelConfig>) => labels;

const LABELS = asLabels({
    enrollment: {
        field: 'displayEnrollmentLabel',
        pluralField: 'displayEnrollmentsLabel',
        singular: () => i18n.t('enrollment'),
        plural: () => i18n.t('enrollments'),
    },
    event: {
        field: 'displayEventLabel',
        pluralField: 'displayEventsLabel',
        singular: () => i18n.t('event'),
        plural: () => i18n.t('events'),
    },
    programStage: {
        field: 'displayProgramStageLabel',
        pluralField: 'displayProgramStagesLabel',
        singular: () => i18n.t('program stage'),
        plural: () => i18n.t('program stages'),
    },
    note: {
        field: 'displayNoteLabel',
        pluralField: 'displayNotesLabel',
        singular: () => i18n.t('note'),
        plural: () => i18n.t('notes'),
    },
    relationship: {
        field: 'displayRelationshipLabel',
        pluralField: 'displayRelationshipsLabel',
        singular: () => i18n.t('relationship'),
        plural: () => i18n.t('relationships'),
    },
    attribute: {
        field: 'displayTrackedEntityAttributeLabel',
        pluralField: 'displayTrackedEntityAttributesLabel',
        singular: () => i18n.t('attribute'),
        plural: () => i18n.t('attributes'),
    },
    orgUnit: {
        field: 'displayOrgUnitLabel',
        singular: () => i18n.t('organisation unit'),
    },
    followUp: {
        field: 'displayFollowUpLabel',
        singular: () => i18n.t('follow-up'),
    },
});

export type CustomLabelKey = keyof typeof LABELS;
export type CustomLabels = Record<string, string>;
export type LabelOptions = { plural?: boolean };

const ALL_FIELD_NAMES = Object.values(LABELS).flatMap(
    ({ field, pluralField }) => (pluralField ? [field, pluralField] : [field]),
);

export const extractCustomLabels = (cached: Record<string, unknown>): CustomLabels =>
    Object.fromEntries(
        ALL_FIELD_NAMES
            .filter(field => typeof cached[field] === 'string')
            .map(field => [field, cached[field] as string]),
    );

type LabelSource = CustomLabels | undefined | null;

export const resolveLabel = (
    sources: LabelSource | Array<LabelSource>,
    key: CustomLabelKey,
    { plural = false }: LabelOptions = {},
): string | undefined => {
    const { field, pluralField } = LABELS[key];
    const target = plural ? pluralField : field;
    if (!target) return undefined;
    const list = Array.isArray(sources) ? sources : [sources];
    return list.find(source => source?.[target])?.[target];
};

type TermLabelOptions = LabelOptions & { stageId?: string; programId?: string };

const resolveTerm = (
    programId: string | undefined,
    key: CustomLabelKey,
    { stageId, plural = false }: TermLabelOptions,
): string => {
    const program = programId ? programCollection.get(programId) : undefined;
    const stage = program && stageId ? program.getStage(stageId) : undefined;
    const custom = resolveLabel([stage?.customLabels, program?.customLabels], key, { plural });
    if (custom) return custom;
    if (plural) return LABELS[key].plural?.() ?? `${key}s`;
    return LABELS[key].singular();
};

export const getTermLabel = (
    programId: string | undefined,
    key: CustomLabelKey,
    options: TermLabelOptions = {},
): string => resolveTerm(programId, key, options);

export const useTermLabel = (
    key: CustomLabelKey,
    options: TermLabelOptions = {},
): string => {
    const { programId, stageId, plural } = options;
    const currentProgramId = useSelector(({ currentSelections }: any) => currentSelections.programId);
    const id = programId ?? currentProgramId;
    return useMemo(
        () => resolveTerm(id, key, { stageId, plural }),
        [id, key, stageId, plural],
    );
};
