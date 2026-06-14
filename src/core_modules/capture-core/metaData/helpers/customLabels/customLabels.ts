/**
 * Configurable terminology (DHIS2-16581 + v43 plurals).
 *
 * Each term maps to the backend field(s) that hold the custom (translated) label.
 * The resolver returns the configured custom string, or `undefined` when none is
 * set — callers fall back to their existing default term (`?? i18n.t('…')`).
 */
type TermDef = {
    field?: string,
    pluralField?: string,
};

export const TERMS = {
    enrollment: { field: 'displayEnrollmentLabel', pluralField: 'displayEnrollmentsLabel' },
    followUp: { field: 'displayFollowUpLabel' },
    orgUnit: { field: 'displayOrgUnitLabel' },
    relationship: { field: 'displayRelationshipLabel' },
    note: { field: 'displayNoteLabel' },
    attribute: { field: 'displayTrackedEntityAttributeLabel' },
    programStage: { field: 'displayProgramStageLabel', pluralField: 'displayProgramStagesLabel' },
    event: { field: 'displayEventLabel', pluralField: 'displayEventsLabel' },
    trackedEntityType: { pluralField: 'displayTrackedEntityTypesLabel' },
} as const satisfies { [key: string]: TermDef };

export type TermKey = keyof typeof TERMS;
export type CustomLabels = Record<string, string>;
export type LabelOptions = { plural?: boolean };

const allFields: Array<string> = Array.from(
    new Set(
        Object.values(TERMS)
            .flatMap((term: TermDef) => [term.field, term.pluralField])
            .filter((field): field is string => Boolean(field)),
    ),
);

/** Copies the present custom-label values out of a cached metadata object. */
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

/**
 * Resolves the custom label for a term against one or more sources, checked in
 * order (e.g. stage then program). Returns `undefined` when no custom label is
 * configured, so the caller keeps its own default term.
 *
 * For a plural slot: a term with a backend plural field uses that field; a
 * singular-only term reuses its singular custom value.
 */
export const resolveLabel = (
    sources: LabelSource | Array<LabelSource>,
    key: TermKey,
    { plural = false }: LabelOptions = {},
): string | undefined => {
    const term: TermDef = TERMS[key];
    const list = Array.isArray(sources) ? sources : [sources];
    const pick = (field?: string) => (field ? list.find(source => source?.[field])?.[field] : undefined);

    if (plural) {
        return term.pluralField ? pick(term.pluralField) : pick(term.field);
    }
    return pick(term.field);
};

type WithLabels = { customLabels?: CustomLabels } | undefined | null;

export const getProgramLabel = (program: WithLabels, key: TermKey, options?: LabelOptions): string | undefined =>
    resolveLabel(program?.customLabels, key, options);

export const getStageLabel = (
    stage: WithLabels,
    program: WithLabels,
    key: TermKey,
    options?: LabelOptions,
): string | undefined => resolveLabel([stage?.customLabels, program?.customLabels], key, options);

export const getTrackedEntityTypeLabel = (
    trackedEntityType: WithLabels,
    key: TermKey,
    options?: LabelOptions,
): string | undefined => resolveLabel(trackedEntityType?.customLabels, key, options);
