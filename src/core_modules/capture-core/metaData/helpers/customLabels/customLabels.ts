type CustomLabelField = {
    field?: string,
    pluralField?: string,
};

export const CUSTOM_LABEL_FIELDS = {
    enrollment: { field: 'displayEnrollmentLabel', pluralField: 'displayEnrollmentsLabel' },
    event: { field: 'displayEventLabel', pluralField: 'displayEventsLabel' },
    programStage: { field: 'displayProgramStageLabel', pluralField: 'displayProgramStagesLabel' },
    note: { field: 'displayNoteLabel' },
    relationship: { field: 'displayRelationshipLabel' },
    attribute: { field: 'displayTrackedEntityAttributeLabel' },
    orgUnit: { field: 'displayOrgUnitLabel' },
    followUp: { field: 'displayFollowUpLabel' },
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
        if (cached[field]) labels[field] = cached[field];
    });
    return labels;
};

type LabelSource = CustomLabels | undefined | null;

export const resolveLabel = (
    sources: LabelSource | Array<LabelSource>,
    key: CustomLabelKey,
    { plural = false }: LabelOptions = {},
): string | undefined => {
    const term = CUSTOM_LABEL_FIELDS[key] as CustomLabelField;
    const list = Array.isArray(sources) ? sources : [sources];
    const pick = (field?: string) => (field ? list.find(s => s?.[field])?.[field] : undefined);
    if (plural && term.pluralField) {
        return pick(term.pluralField) ?? pick(term.field);
    }
    return pick(term.field);
};
