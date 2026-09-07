import i18n from '@dhis2/d2-i18n';

export type LabelConfig = {
    apiFieldSingular: string;
    apiFieldPlural?: string;
    defaultSingular: () => string;
    defaultPlural?: () => string;
};

export const LABELS = {
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
        apiFieldPlural: 'displayNotesLabel',
        defaultSingular: () => i18n.t('note'),
        defaultPlural: () => i18n.t('notes'),
    },
    relationship: {
        apiFieldSingular: 'displayRelationshipLabel',
        apiFieldPlural: 'displayRelationshipsLabel',
        defaultSingular: () => i18n.t('relationship'),
        defaultPlural: () => i18n.t('relationships'),
    },
    attribute: {
        apiFieldSingular: 'displayTrackedEntityAttributeLabel',
        apiFieldPlural: 'displayTrackedEntityAttributesLabel',
        defaultSingular: () => i18n.t('attribute'),
        defaultPlural: () => i18n.t('attributes'),
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

export const LabelKeys = {
    enrollmentSingular: 'enrollment',
    enrollmentPlural: { key: 'enrollment', plural: true },
    eventSingular: 'event',
    eventPlural: { key: 'event', plural: true },
    programStageSingular: 'programStage',
    programStagePlural: { key: 'programStage', plural: true },
    noteSingular: 'note',
    notePlural: { key: 'note', plural: true },
    relationshipSingular: 'relationship',
    relationshipPlural: { key: 'relationship', plural: true },
    attributeSingular: 'attribute',
    attributePlural: { key: 'attribute', plural: true },
    orgUnitSingular: 'orgUnit',
    followUpSingular: 'followUp',
} as const;
