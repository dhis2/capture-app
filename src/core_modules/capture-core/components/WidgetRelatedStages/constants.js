// @flow
import i18n from '@dhis2/d2-i18n';

export const relatedStageStatus = Object.freeze({
    LINKABLE: 'LINKABLE',
    AMBIGUOUS_RELATIONSHIPS: 'AMBIGUOUS_RELATIONSHIPS',
});

export const actions = Object.freeze({
    SCHEDULE_IN_ORG: 'SCHEDULE_IN_ORG',
    LINK_EXISTING_RESPONSE: 'LINK_EXISTING_RESPONSE',
    ENTER_DATA: 'ENTER_DATA',
    DO_NOT_LINK_RESPONSE: 'DO_NOT_LINK_RESPONSE',
});

export const mainOptionTranslatedTexts = {
    [actions.SCHEDULE_IN_ORG]: (displayName?: string) => i18n.t('Schedule in {{displayName}}', { displayName }),
    [actions.LINK_EXISTING_RESPONSE]: (displayName?: string) => i18n.t('Link to an existing {{displayName}}', { displayName }),
    [actions.ENTER_DATA]: (displayName?: string) => i18n.t('Enter {{displayName}} details now', { displayName }),
    [actions.DO_NOT_LINK_RESPONSE]: (displayName?: string) => i18n.t("Don't link to a {{displayName}}", { displayName }),
};
