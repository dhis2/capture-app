import i18n from '@dhis2/d2-i18n';

/**
 * Configurable terminology (DHIS2-16581 + v43 plurals).
 *
 * Single source of truth: each term declares the backend field(s) that hold its
 * custom value and the translated defaults. The resolver returns the custom label
 * if configured, otherwise the translated default.
 *
 * Default strings are wrapped in thunks (not evaluated at module load) so i18n.t()
 * resolves against the active locale, and are written as literals so the i18n
 * extractor can find them.
 */
type TermDef = {
    field?: string,
    pluralField?: string,
    singular: () => string,
    plural: () => string,
    singularLower: () => string,
    pluralLower: () => string,
};

export const TERMS: { [key: string]: TermDef } = {
    enrollment: {
        field: 'displayEnrollmentLabel',
        pluralField: 'displayEnrollmentsLabel',
        singular: () => i18n.t('Enrollment'),
        plural: () => i18n.t('Enrollments'),
        singularLower: () => i18n.t('enrollment'),
        pluralLower: () => i18n.t('enrollments'),
    },
    followUp: {
        field: 'displayFollowUpLabel',
        singular: () => i18n.t('Follow-up'),
        plural: () => i18n.t('Follow-ups'),
        singularLower: () => i18n.t('follow-up'),
        pluralLower: () => i18n.t('follow-ups'),
    },
    orgUnit: {
        field: 'displayOrgUnitLabel',
        singular: () => i18n.t('Organisation unit'),
        plural: () => i18n.t('Organisation units'),
        singularLower: () => i18n.t('organisation unit'),
        pluralLower: () => i18n.t('organisation units'),
    },
    relationship: {
        field: 'displayRelationshipLabel',
        singular: () => i18n.t('Relationship'),
        plural: () => i18n.t('Relationships'),
        singularLower: () => i18n.t('relationship'),
        pluralLower: () => i18n.t('relationships'),
    },
    note: {
        field: 'displayNoteLabel',
        singular: () => i18n.t('Note'),
        plural: () => i18n.t('Notes'),
        singularLower: () => i18n.t('note'),
        pluralLower: () => i18n.t('notes'),
    },
    attribute: {
        field: 'displayTrackedEntityAttributeLabel',
        singular: () => i18n.t('Attribute'),
        plural: () => i18n.t('Attributes'),
        singularLower: () => i18n.t('attribute'),
        pluralLower: () => i18n.t('attributes'),
    },
    programStage: {
        field: 'displayProgramStageLabel',
        pluralField: 'displayProgramStagesLabel',
        singular: () => i18n.t('Program stage'),
        plural: () => i18n.t('Program stages'),
        singularLower: () => i18n.t('program stage'),
        pluralLower: () => i18n.t('program stages'),
    },
    event: {
        field: 'displayEventLabel',
        pluralField: 'displayEventsLabel',
        singular: () => i18n.t('Event'),
        plural: () => i18n.t('Events'),
        singularLower: () => i18n.t('event'),
        pluralLower: () => i18n.t('events'),
    },
    trackedEntityType: {
        pluralField: 'displayTrackedEntityTypesLabel',
        singular: () => i18n.t('Tracked entity type'),
        plural: () => i18n.t('Tracked entity types'),
        singularLower: () => i18n.t('tracked entity type'),
        pluralLower: () => i18n.t('tracked entity types'),
    },
};

export type TermKey = keyof typeof TERMS;
export type CustomLabels = Record<string, string>;
export type LabelOptions = { plural?: boolean, lowercase?: boolean };

const allFields: Array<string> = Array.from(
    new Set(
        Object.values(TERMS)
            .flatMap(term => [term.field, term.pluralField])
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
 * Resolves a term against one or more label sources, checked in order (e.g. stage
 * then program). Falls back to the translated default when no custom label is set.
 *
 * Plural rules:
 *  - term with a backend plural field → plural custom, else plural default
 *  - singular-only term → singular custom (reused), else plural default
 */
export const resolveLabel = (
    sources: LabelSource | Array<LabelSource>,
    key: TermKey,
    { plural = false, lowercase = false }: LabelOptions = {},
): string => {
    const term = TERMS[key];
    const list = Array.isArray(sources) ? sources : [sources];
    const pick = (field?: string) => (field ? list.find(source => source?.[field])?.[field] : undefined);

    if (plural) {
        const custom = term.pluralField ? pick(term.pluralField) : pick(term.field);
        return custom ?? (lowercase ? term.pluralLower() : term.plural());
    }
    return pick(term.field) ?? (lowercase ? term.singularLower() : term.singular());
};

type WithLabels = { customLabels?: CustomLabels } | undefined | null;

export const getProgramLabel = (program: WithLabels, key: TermKey, options?: LabelOptions): string =>
    resolveLabel(program?.customLabels, key, options);

export const getStageLabel = (
    stage: WithLabels,
    program: WithLabels,
    key: TermKey,
    options?: LabelOptions,
): string => resolveLabel([stage?.customLabels, program?.customLabels], key, options);

export const getTrackedEntityTypeLabel = (
    trackedEntityType: WithLabels,
    key: TermKey,
    options?: LabelOptions,
): string => resolveLabel(trackedEntityType?.customLabels, key, options);
