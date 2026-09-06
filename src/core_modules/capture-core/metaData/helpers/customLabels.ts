import i18n from '@dhis2/d2-i18n';
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

export const LabelKeys = {
    enrollment: 'enrollment',
    event: 'event',
    programStage: 'programStage',
    note: 'note',
    relationship: 'relationship',
    attribute: 'attribute',
    orgUnit: 'orgUnit',
    followUp: 'followUp',
} as const satisfies { [K in CustomLabelKey]: K };

export type TermRequest =
    | CustomLabelKey
    | { key: CustomLabelKey; plural?: boolean };

type LabelSource = Record<string, unknown> | undefined | null;
type GetTermLabelFromProgramOptions = { program: LabelSource };
type GetTermLabelOptions = { programId: string | null | undefined; stageId?: string | null };
type UseTermLabelOptions = { programId?: string | null; stageId?: string | null };

const ALL_FIELD_NAMES = Object.values(LABELS).flatMap(
    ({ field, pluralField }) => (pluralField ? [field, pluralField] : [field]),
);

const resolveDefault = (key: CustomLabelKey, plural: boolean): string => {
    const label = LABELS[key];
    return plural ? label.plural?.() ?? label.singular() : label.singular();
};

const resolveLabel = (
    sources: ReadonlyArray<LabelSource>,
    key: CustomLabelKey,
    plural: boolean,
): string => {
    const { field, pluralField } = LABELS[key];
    const target = plural ? pluralField : field;
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
