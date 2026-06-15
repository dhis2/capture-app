type CustomLabelField = {
    field?: string,
    pluralField?: string,
};

export const CUSTOM_LABEL_FIELDS = {
    enrollment: { field: 'displayEnrollmentLabel', pluralField: 'displayEnrollmentsLabel' },
    followUp: { field: 'displayFollowUpLabel' },
    orgUnit: { field: 'displayOrgUnitLabel' },
    relationship: { field: 'displayRelationshipLabel' },
    note: { field: 'displayNoteLabel' },
    attribute: { field: 'displayTrackedEntityAttributeLabel' },
    programStage: { field: 'displayProgramStageLabel', pluralField: 'displayProgramStagesLabel' },
    event: { field: 'displayEventLabel', pluralField: 'displayEventsLabel' },
    trackedEntityType: { pluralField: 'displayTrackedEntityTypesLabel' },
} as const satisfies { [key: string]: CustomLabelField };

export type CustomLabelKey = keyof typeof CUSTOM_LABEL_FIELDS;
export type CustomLabels = Record<string, string>;
export type LabelOptions = { plural?: boolean };

const allFields: Array<string> = Array.from(
    new Set(
        Object.values(CUSTOM_LABEL_FIELDS)
            .flatMap((term: CustomLabelField) => [term.field, term.pluralField])
            .filter((field): field is string => Boolean(field)),
    ),
);

export const extractCustomLabels = (cached: Record<string, any>): CustomLabels => {
    const labels: CustomLabels = {};
    allFields.forEach((field) => {
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

    if (plural) {
        return term.pluralField ? pick(term.pluralField) : pick(term.field);
    }
    return pick(term.field);
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
