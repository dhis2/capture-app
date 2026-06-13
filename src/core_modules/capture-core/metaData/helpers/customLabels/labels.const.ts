import i18n from '@dhis2/d2-i18n';

/**
 * Keys for the configurable terminology labels (DHIS2-16581).
 * A program / program stage / tracked entity type can override the default term
 * shown in the UI; when no custom label is configured we fall back to the
 * translated default (see getDefaultLabel).
 */
// Keys map 1:1 to the configurable label fields exposed by the backend / MMA.
// Singular-only terms (no backend plural) are pluralised at render time via the
// `plural` option on the resolver, which reuses the singular custom value.
export const labelKeys = Object.freeze({
    ENROLLMENT: 'ENROLLMENT',
    ENROLLMENTS: 'ENROLLMENTS',
    FOLLOW_UP: 'FOLLOW_UP',
    ORG_UNIT: 'ORG_UNIT',
    RELATIONSHIP: 'RELATIONSHIP',
    NOTE: 'NOTE',
    TRACKED_ENTITY_ATTRIBUTE: 'TRACKED_ENTITY_ATTRIBUTE',
    PROGRAM_STAGE: 'PROGRAM_STAGE',
    PROGRAM_STAGES: 'PROGRAM_STAGES',
    EVENT: 'EVENT',
    EVENTS: 'EVENTS',
    TRACKED_ENTITY_TYPES: 'TRACKED_ENTITY_TYPES',
});

export type LabelKey = typeof labelKeys[keyof typeof labelKeys];

export type CustomLabels = { [key in LabelKey]?: string };

/**
 * Maps each label key to the cached metadata field that holds the custom value.
 * Used by the metadata factories to populate the sparse customLabels map.
 */
export const programLabelFields: { [key in LabelKey]?: string } = Object.freeze({
    [labelKeys.ENROLLMENT]: 'displayEnrollmentLabel',
    [labelKeys.ENROLLMENTS]: 'displayEnrollmentsLabel',
    [labelKeys.FOLLOW_UP]: 'displayFollowUpLabel',
    [labelKeys.ORG_UNIT]: 'displayOrgUnitLabel',
    [labelKeys.RELATIONSHIP]: 'displayRelationshipLabel',
    [labelKeys.NOTE]: 'displayNoteLabel',
    [labelKeys.TRACKED_ENTITY_ATTRIBUTE]: 'displayTrackedEntityAttributeLabel',
    [labelKeys.PROGRAM_STAGE]: 'displayProgramStageLabel',
    [labelKeys.PROGRAM_STAGES]: 'displayProgramStagesLabel',
    [labelKeys.EVENT]: 'displayEventLabel',
    [labelKeys.EVENTS]: 'displayEventsLabel',
});

export const programStageLabelFields: { [key in LabelKey]?: string } = Object.freeze({
    [labelKeys.PROGRAM_STAGE]: 'displayProgramStageLabel',
    [labelKeys.EVENT]: 'displayEventLabel',
    [labelKeys.EVENTS]: 'displayEventsLabel',
});

export const trackedEntityTypeLabelFields: { [key in LabelKey]?: string } = Object.freeze({
    [labelKeys.TRACKED_ENTITY_TYPES]: 'displayTrackedEntityTypesLabel',
});

// Built lazily (inside getDefaultLabel) so i18n.t() resolves against the active locale.
const getCapitalizedDefaults = (): { [key in LabelKey]: string } => ({
    [labelKeys.ENROLLMENT]: i18n.t('Enrollment'),
    [labelKeys.ENROLLMENTS]: i18n.t('Enrollments'),
    [labelKeys.FOLLOW_UP]: i18n.t('Follow-up'),
    [labelKeys.ORG_UNIT]: i18n.t('Organisation unit'),
    [labelKeys.RELATIONSHIP]: i18n.t('Relationship'),
    [labelKeys.NOTE]: i18n.t('Note'),
    [labelKeys.TRACKED_ENTITY_ATTRIBUTE]: i18n.t('Attribute'),
    [labelKeys.PROGRAM_STAGE]: i18n.t('Program stage'),
    [labelKeys.PROGRAM_STAGES]: i18n.t('Program stages'),
    [labelKeys.EVENT]: i18n.t('Event'),
    [labelKeys.EVENTS]: i18n.t('Events'),
    [labelKeys.TRACKED_ENTITY_TYPES]: i18n.t('Tracked entity types'),
});

// Mid-sentence form (e.g. "Are you sure you want to delete this event?").
const getLowercaseDefaults = (): { [key in LabelKey]: string } => ({
    [labelKeys.ENROLLMENT]: i18n.t('enrollment'),
    [labelKeys.ENROLLMENTS]: i18n.t('enrollments'),
    [labelKeys.FOLLOW_UP]: i18n.t('follow-up'),
    [labelKeys.ORG_UNIT]: i18n.t('organisation unit'),
    [labelKeys.RELATIONSHIP]: i18n.t('relationship'),
    [labelKeys.NOTE]: i18n.t('note'),
    [labelKeys.TRACKED_ENTITY_ATTRIBUTE]: i18n.t('attribute'),
    [labelKeys.PROGRAM_STAGE]: i18n.t('program stage'),
    [labelKeys.PROGRAM_STAGES]: i18n.t('program stages'),
    [labelKeys.EVENT]: i18n.t('event'),
    [labelKeys.EVENTS]: i18n.t('events'),
    [labelKeys.TRACKED_ENTITY_TYPES]: i18n.t('tracked entity types'),
});

// Plural defaults for singular-only terms (no backend plural field). Used when a
// plural UI slot has no custom label configured; if a custom label IS configured
// the singular custom value is used instead (see resolver).
const getCapitalizedPluralDefaults = (): { [key in LabelKey]?: string } => ({
    [labelKeys.FOLLOW_UP]: i18n.t('Follow-ups'),
    [labelKeys.ORG_UNIT]: i18n.t('Organisation units'),
    [labelKeys.RELATIONSHIP]: i18n.t('Relationships'),
    [labelKeys.NOTE]: i18n.t('Notes'),
    [labelKeys.TRACKED_ENTITY_ATTRIBUTE]: i18n.t('Attributes'),
});

const getLowercasePluralDefaults = (): { [key in LabelKey]?: string } => ({
    [labelKeys.FOLLOW_UP]: i18n.t('follow-ups'),
    [labelKeys.ORG_UNIT]: i18n.t('organisation units'),
    [labelKeys.RELATIONSHIP]: i18n.t('relationships'),
    [labelKeys.NOTE]: i18n.t('notes'),
    [labelKeys.TRACKED_ENTITY_ATTRIBUTE]: i18n.t('attributes'),
});

type GetDefaultLabelOptions = { lowercase?: boolean, plural?: boolean };

/**
 * Returns the translated default term for a label key. Custom labels (entered by
 * the implementer) are used verbatim; only this default is translated/cased here.
 * `plural` provides a plural default for singular-only terms (note, relationship,
 * org unit, attribute, follow-up) which have no dedicated plural field.
 */
export const getDefaultLabel = (
    key: LabelKey,
    { lowercase = false, plural = false }: GetDefaultLabelOptions = {},
): string => {
    if (plural) {
        const pluralDefaults = lowercase ? getLowercasePluralDefaults() : getCapitalizedPluralDefaults();
        const pluralDefault = pluralDefaults[key];
        if (pluralDefault) {
            return pluralDefault;
        }
    }
    const defaults = lowercase ? getLowercaseDefaults() : getCapitalizedDefaults();
    return defaults[key];
};
