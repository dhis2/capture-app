export type CustomLabelForm = {
    field: string,
    english: string,
    aliases?: ReadonlyArray<string>,
};

export type CustomLabelField = {
    singular: CustomLabelForm,
    plural?: CustomLabelForm,
};

export const CUSTOM_LABEL_FIELDS = {
    enrollment: {
        singular: { field: 'displayEnrollmentLabel', english: 'enrollment' },
        plural: { field: 'displayEnrollmentsLabel', english: 'enrollments' },
    },
    event: {
        singular: { field: 'displayEventLabel', english: 'event' },
        plural: { field: 'displayEventsLabel', english: 'events' },
    },
    note: {
        singular: { field: 'displayNoteLabel', english: 'note' },
        plural: { field: 'displayNotesLabel', english: 'notes' },
    },
    relationship: {
        singular: { field: 'displayRelationshipLabel', english: 'relationship' },
        plural: { field: 'displayRelationshipsLabel', english: 'relationships' },
    },
    attribute: {
        singular: { field: 'displayTrackedEntityAttributeLabel', english: 'attribute' },
        plural: { field: 'displayTrackedEntityAttributesLabel', english: 'attributes' },
    },
    programStage: {
        singular: { field: 'displayProgramStageLabel', english: 'program stage' },
        plural: { field: 'displayProgramStagesLabel', english: 'program stages' },
    },
    orgUnit: {
        singular: { field: 'displayOrgUnitLabel', english: 'organisation unit' },
        plural: { field: 'displayOrgUnitLabel', english: 'organisation units' },
    },
    followUp: {
        singular: { field: 'displayFollowUpLabel', english: 'follow-up' },
    },
} as const satisfies { [key: string]: CustomLabelField };

export type CustomLabelKey = keyof typeof CUSTOM_LABEL_FIELDS;
export type CustomLabels = Record<string, string>;
export type LabelOptions = { plural?: boolean };

const ALL_FIELDS: ReadonlyArray<string> = Array.from(
    new Set(
        Object.values(CUSTOM_LABEL_FIELDS)
            .flatMap((term: CustomLabelField) => [term.singular.field, term.plural?.field])
            .filter((field): field is string => Boolean(field)),
    ),
);

export const extractCustomLabels = (cached: Record<string, unknown>): CustomLabels => {
    const labels: CustomLabels = {};
    ALL_FIELDS.forEach((field) => {
        const value = cached[field];
        if (typeof value === 'string' && value) {
            labels[field] = value;
        }
    });
    return labels;
};

type LabelSource = CustomLabels | undefined | null;

export const resolveCustomLabel = (
    sources: LabelSource | Array<LabelSource>,
    key: CustomLabelKey,
    { plural = false }: LabelOptions = {},
): string | undefined => {
    const term: CustomLabelField = CUSTOM_LABEL_FIELDS[key];
    const list = Array.isArray(sources) ? sources : [sources];
    const form = plural && term.plural ? term.plural : term.singular;
    return list.find(source => source?.[form.field])?.[form.field];
};
