import { capitalizeFirstLetter } from 'capture-core-utils/string';

type CustomLabelField = {
    singular?: string,
    plural?: string,
};

export const CUSTOM_LABEL_FIELDS = {
    enrollment: { singular: 'displayEnrollmentLabel', plural: 'displayEnrollmentsLabel' },
    followUp: { singular: 'displayFollowUpLabel' },
    orgUnit: { singular: 'displayOrgUnitLabel' },
    note: { plural: 'displayNotesLabel' },
    relationship: { plural: 'displayRelationshipsLabel' },
    attribute: { plural: 'displayTrackedEntityAttributesLabel' },
    programStage: { singular: 'displayProgramStageLabel', plural: 'displayProgramStagesLabel' },
    event: { singular: 'displayEventLabel', plural: 'displayEventsLabel' },
    trackedEntityType: { singular: 'displayName', plural: 'displayTrackedEntityTypesLabel' },
} as const satisfies { [key: string]: CustomLabelField };

export type CustomLabelKey = keyof typeof CUSTOM_LABEL_FIELDS;
export type CustomLabels = Record<string, string>;
export type LabelOptions = { plural?: boolean };
export type CustomLabelScope = 'program' | 'programStage' | 'trackedEntityType';

const KEYS_BY_SCOPE: Record<CustomLabelScope, ReadonlyArray<CustomLabelKey>> = {
    program: ['enrollment', 'followUp', 'orgUnit', 'note', 'relationship', 'programStage', 'event'],
    programStage: ['programStage', 'event'],
    trackedEntityType: ['trackedEntityType', 'attribute'],
};

const FIELDS_BY_SCOPE: Record<CustomLabelScope, ReadonlyArray<string>> = {
    program: [],
    programStage: [],
    trackedEntityType: [],
};
(Object.keys(KEYS_BY_SCOPE) as Array<CustomLabelScope>).forEach((scope) => {
    const fields = new Set<string>();
    KEYS_BY_SCOPE[scope].forEach((key) => {
        const term: CustomLabelField = CUSTOM_LABEL_FIELDS[key];
        if (term.singular) fields.add(term.singular);
        if (term.plural) fields.add(term.plural);
    });
    FIELDS_BY_SCOPE[scope] = Array.from(fields);
});

export const extractCustomLabels = (
    cached: Record<string, any>,
    scope: CustomLabelScope,
): CustomLabels => {
    const labels: CustomLabels = {};
    FIELDS_BY_SCOPE[scope].forEach((field) => {
        if (cached[field]) {
            labels[field] = cached[field];
        }
    });
    return labels;
};

type LabelSource = CustomLabels | undefined | null;

export const resolveLabel = (
    sources: LabelSource | Array<LabelSource>,
    key: CustomLabelKey,
    { plural = false }: LabelOptions = {},
): string | undefined => {
    const term: CustomLabelField = CUSTOM_LABEL_FIELDS[key];
    const list = Array.isArray(sources) ? sources : [sources];
    const pick = (field?: string) => (field ? list.find(source => source?.[field])?.[field] : undefined);

    const field = plural && term.plural ? term.plural : term.singular;
    const value = pick(field);
    return value ? capitalizeFirstLetter(value) : value;
};

type WithLabels = { customLabels?: CustomLabels } | undefined | null;

export const getProgramLabel = (program: WithLabels, key: CustomLabelKey, options?: LabelOptions): string | undefined =>
    resolveLabel(program?.customLabels, key, options);

export const getStageLabel = (
    stage: WithLabels,
    program: WithLabels,
    key: CustomLabelKey,
    options?: LabelOptions,
): string | undefined => resolveLabel([stage?.customLabels, program?.customLabels], key, options);

export const getTrackedEntityTypeLabel = (
    trackedEntityType: WithLabels,
    key: CustomLabelKey,
    options?: LabelOptions,
): string | undefined => resolveLabel(trackedEntityType?.customLabels, key, options);
