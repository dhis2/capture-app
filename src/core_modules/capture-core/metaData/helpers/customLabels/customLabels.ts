// Owns the shape and lookup of program/stage/tracked-entity-type custom labels:
//   - CUSTOM_LABEL_FIELDS is the single source of truth: for each DHIS2 term it
//     names the API field to read (per singular/plural), the English word to
//     look for in translated strings, and any aliases.
//   - extractCustomLabels reads them off the API cache when domain objects are
//     built (ProgramFactory / ProgramStageFactory / TrackedEntityTypeFactory).
//   - resolveCustomLabel picks a label from those sources at substitution time
//     (called by the postProcessor in applyCustomTerminology).
// Previously also exported resolveLabel/getProgramLabel/useProgramLabel which
// forced capitalization at every call site; that pattern is gone since the
// postProcessor now handles case at the point of substitution.

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
    },
    relationship: {
        singular: { field: 'displayRelationshipLabel', english: 'relationship' },
    },
    attribute: {
        singular: { field: 'displayTrackedEntityAttributeLabel', english: 'attribute' },
    },
    programStage: {
        singular: { field: 'displayProgramStageLabel', english: 'program stage', aliases: ['stage'] },
        plural: { field: 'displayProgramStagesLabel', english: 'program stages', aliases: ['stages'] },
    },
    // API only exposes a singular custom label for orgUnit; we reuse it for the
    // plural form so "organisation units" resolves to the same admin-set string.
    orgUnit: {
        singular: { field: 'displayOrgUnitLabel', english: 'organisation unit' },
        plural: { field: 'displayOrgUnitLabel', english: 'organisation units' },
    },
    trackedEntityType: {
        singular: { field: 'displayTrackedEntityTypeLabel', english: 'tracked entity' },
        plural: { field: 'displayTrackedEntityTypesLabel', english: 'tracked entities' },
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
    if (!form) return undefined;
    return list.find(source => source?.[form.field])?.[form.field];
};
