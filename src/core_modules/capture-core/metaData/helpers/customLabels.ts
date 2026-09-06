import i18n from '@dhis2/d2-i18n';
import { useSelector } from 'react-redux';
import { programCollection } from '../../metaDataMemoryStores';

type LabelConfig = {
    apiFieldSingular: string;
    apiFieldPlural?: string;
    defaultSingular: () => string;
    defaultPlural?: () => string;
};

const LABELS = {
    enrollment: {
        apiFieldSingular: 'displayEnrollmentLabel',
        apiFieldPlural: 'displayEnrollmentsLabel',
        defaultSingular: () => i18n.t('enrollment'),
        defaultPlural: () => i18n.t('enrollments'),
    },
    event: {
        apiFieldSingular: 'displayEventLabel',
        apiFieldPlural: 'displayEventsLabel',
        defaultSingular: () => i18n.t('event'),
        defaultPlural: () => i18n.t('events'),
    },
    programStage: {
        apiFieldSingular: 'displayProgramStageLabel',
        apiFieldPlural: 'displayProgramStagesLabel',
        defaultSingular: () => i18n.t('program stage'),
        defaultPlural: () => i18n.t('program stages'),
    },
    note: {
        apiFieldSingular: 'displayNoteLabel',
        defaultSingular: () => i18n.t('note'),
    },
    relationship: {
        apiFieldSingular: 'displayRelationshipLabel',
        defaultSingular: () => i18n.t('relationship'),
    },
    attribute: {
        apiFieldSingular: 'displayTrackedEntityAttributeLabel',
        defaultSingular: () => i18n.t('attribute'),
    },
    orgUnit: {
        apiFieldSingular: 'displayOrgUnitLabel',
        defaultSingular: () => i18n.t('organisation unit'),
    },
    followUp: {
        apiFieldSingular: 'displayFollowUpLabel',
        defaultSingular: () => i18n.t('follow-up'),
    },
} satisfies Record<string, LabelConfig>;

export type CustomLabelKey = keyof typeof LABELS;
export type CustomLabels = Record<string, string>;

type KeysWithPlural = {
    [K in CustomLabelKey]: typeof LABELS[K] extends { apiFieldPlural: string } ? K : never
}[CustomLabelKey];

export const LabelKeys = {
    enrollmentSingular: 'enrollment',
    enrollmentPlural: { key: 'enrollment', plural: true },
    eventSingular: 'event',
    eventPlural: { key: 'event', plural: true },
    programStageSingular: 'programStage',
    programStagePlural: { key: 'programStage', plural: true },
    noteSingular: 'note',
    relationshipSingular: 'relationship',
    attributeSingular: 'attribute',
    orgUnitSingular: 'orgUnit',
    followUpSingular: 'followUp',
} as const satisfies
    & { [K in CustomLabelKey as `${K}Singular`]: K }
    & Partial<{ [K in KeysWithPlural as `${K}Plural`]: { key: K; plural: true } }>;

export type TermRequest =
    | CustomLabelKey
    | { key: KeysWithPlural; plural: true }
    | { key: CustomLabelKey; plural?: false };

type LabelSource = Record<string, unknown> | undefined | null;
type GetTermLabelFromProgramOptions = { program: LabelSource };
type GetTermLabelOptions = { programId: string | null | undefined; stageId?: string | null };
type UseTermLabelOptions = { programId?: string | null; stageId?: string | null };

const getLabel = (key: CustomLabelKey): LabelConfig => LABELS[key];

const ALL_FIELD_NAMES = Object.values(LABELS as Record<string, LabelConfig>).flatMap(
    ({ apiFieldSingular, apiFieldPlural }) => (apiFieldPlural ? [apiFieldSingular, apiFieldPlural] : [apiFieldSingular]),
);

const resolveDefault = (key: CustomLabelKey, plural: boolean): string => {
    const label = getLabel(key);
    return plural ? label.defaultPlural?.() ?? label.defaultSingular() : label.defaultSingular();
};

const resolveLabel = (
    sources: ReadonlyArray<LabelSource>,
    key: CustomLabelKey,
    plural: boolean,
): string => {
    const { apiFieldSingular, apiFieldPlural } = getLabel(key);
    const target = plural ? apiFieldPlural : apiFieldSingular;
    const found = target
        ? sources
            .map(source => source?.[target])
            .find((value): value is string => typeof value === 'string')
        : undefined;
    return found ?? resolveDefault(key, plural);
};

const resolveFromCollection = (
    programId: string | null | undefined,
    stageId: string | null | undefined,
    key: CustomLabelKey,
    plural: boolean,
): string => {
    const program = programId ? programCollection.get(programId) : undefined;
    const stage = program && stageId ? program.getStage(stageId) : undefined;
    return resolveLabel([stage?.customLabels, program?.customLabels], key, plural);
};

const buildLabels = (
    requests: ReadonlyArray<TermRequest>,
    resolve: (key: CustomLabelKey, plural: boolean) => string,
): CustomLabels => {
    const entries = requests.map((req) => {
        const { key, plural } = typeof req === 'string'
            ? { key: req, plural: false }
            : { key: req.key, plural: req.plural ?? false };
        const outputKey = plural ? `${key}sLabel` : `${key}Label`;
        return [outputKey, resolve(key, plural)];
    });
    return Object.fromEntries(entries);
};

export const extractCustomLabels = (cached: Record<string, unknown>): CustomLabels =>
    Object.fromEntries(
        ALL_FIELD_NAMES
            .filter(field => typeof cached[field] === 'string')
            .map(field => [field, cached[field] as string]),
    );

export const getTermLabel = (
    requests: ReadonlyArray<TermRequest>,
    { programId, stageId }: GetTermLabelOptions,
): CustomLabels =>
    buildLabels(requests, (key, plural) => resolveFromCollection(programId, stageId, key, plural));

export const getTermLabelFromProgram = (
    requests: ReadonlyArray<TermRequest>,
    { program }: GetTermLabelFromProgramOptions,
): CustomLabels =>
    buildLabels(requests, (key, plural) => resolveLabel([program], key, plural));

export const useTermLabel = (
    requests: ReadonlyArray<TermRequest>,
    { programId, stageId }: UseTermLabelOptions = {},
): CustomLabels => {
    const activeProgramId = useSelector(({ currentSelections }: any) =>
        programId ?? currentSelections.programId);
    return buildLabels(requests, (key, plural) =>
        resolveFromCollection(activeProgramId, stageId, key, plural));
};
