// @flow
import i18n from '@dhis2/d2-i18n';

export const mainOptionKeys = {
    LAST_WEEK: 'LAST_WEEK',
    LAST_MONTH: 'LAST_MONTH',
    LAST_3_MONTHS: 'LAST_THREE_MONTHS',
    CUSTOM_RANGE: 'CUSTOM_RANGE',
};

export const mainOptionTranslatedTexts = {
    [mainOptionKeys.LAST_WEEK]: i18n.t('Last week'),
    [mainOptionKeys.LAST_MONTH]: i18n.t('Last month'),
    [mainOptionKeys.LAST_3_MONTHS]: i18n.t('Last 3 months'),
    [mainOptionKeys.CUSTOM_RANGE]: i18n.t('Custom range'),
};
