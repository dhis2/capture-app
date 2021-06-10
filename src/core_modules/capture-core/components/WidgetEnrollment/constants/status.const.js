import i18n from '@dhis2/d2-i18n';

export const plainStatus = Object.freeze({
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
});

export const translatedStatus = Object.freeze({
    [plainStatus.ACTIVE]: i18n.t('Active'),
    [plainStatus.COMPLETED]: i18n.t('Complete'),
    [plainStatus.CANCELLED]: i18n.t('Cancelled'),
});
