import i18n from '@dhis2/d2-i18n';

export const relatedStageActions = {
    SCHEDULE_IN_ORG: 'SCHEDULE_IN_ORG',
    ENTER_DATA: 'ENTER_DATA',
    LINK_EXISTING_RESPONSE: 'LINK_EXISTING_RESPONSE',
} as const;

export const mainOptionTranslatedTexts = {
    [relatedStageActions.SCHEDULE_IN_ORG]: i18n.t('Schedule for later'),
    [relatedStageActions.ENTER_DATA]: i18n.t('Enter details now'),
    [relatedStageActions.LINK_EXISTING_RESPONSE]: i18n.t('Link to existing event'),
};

export const relatedStageStatus = {
    LINKABLE: 'LINKABLE',
    NOT_LINKABLE: 'NOT_LINKABLE',
    AMBIGUOUS_RELATIONSHIPS: 'AMBIGUOUS_RELATIONSHIPS',
};
