import i18n from '@dhis2/d2-i18n';

export const relatedStageStatus = Object.freeze({
    LINKABLE: 'LINKABLE',
    AMBIGUOUS_RELATIONSHIPS: 'AMBIGUOUS_RELATIONSHIPS',
});

export const relatedStageActions = Object.freeze({
    SCHEDULE_IN_ORG: 'SCHEDULE_IN_ORG',
    LINK_EXISTING_RESPONSE: 'LINK_EXISTING_RESPONSE',
    ENTER_DATA: 'ENTER_DATA',
});

export const mainOptionTranslatedTexts = {
    [relatedStageActions.SCHEDULE_IN_ORG]: i18n.t('Schedule'),
    [relatedStageActions.ENTER_DATA]: i18n.t('Enter details now'),
    [relatedStageActions.LINK_EXISTING_RESPONSE]: i18n.t('Link to an existing event'),
};
