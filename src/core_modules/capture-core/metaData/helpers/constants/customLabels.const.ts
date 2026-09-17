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
        defaultSingular: () => i18n.t('note'),
    },
    relationship: {
        apiFieldSingular: 'displayRelationshipLabel',
        defaultSingular: () => i18n.t('relationship'),
    },
    attribute: {
        apiFieldSingular: 'displayTrackedEntityAttributeLabel',
        defaultSingular: () => i18n.t('attribute'),
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
    relationshipSingular: 'relationship',
    attributeSingular: 'attribute',
    orgUnitSingular: 'orgUnit',
    followUpSingular: 'followUp',
} as const;
