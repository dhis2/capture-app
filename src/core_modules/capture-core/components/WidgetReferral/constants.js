// @flow
import i18n from '@dhis2/d2-i18n';

export const referralStatus = Object.freeze({
    REFERRABLE: 'REFERRABLE',
    AMBIGUOUS_REFERRALS: 'AMBIGUOUS_REFERRALS',
});

export const actions = Object.freeze({
    REFER_ORG: 'REFER_ORG',
    LINK_EXISTING_RESPONSE: 'LINK_EXISTING_RESPONSE',
    ENTER_DATA: 'ENTER_DATA',
    DO_NOT_LINK_RESPONSE: 'DO_NOT_LINK_RESPONSE',
});

export const mainOptionTranslatedTexts = {
    [actions.REFER_ORG]: i18n.t('Refer to an organisation unit'),
    [actions.LINK_EXISTING_RESPONSE]: i18n.t('Link to an existing response'),
    [actions.ENTER_DATA]: i18n.t('Enter data for response now'),
    [actions.DO_NOT_LINK_RESPONSE]: i18n.t("Don't link to a response"),
};
