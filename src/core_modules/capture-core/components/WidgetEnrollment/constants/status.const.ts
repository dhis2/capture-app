import i18n from '@dhis2/d2-i18n';

export const plainStatus = Object.freeze({
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
});

export const translatedStatus = Object.freeze({
    [plainStatus.ACTIVE]: i18n.t('Active'),
    [plainStatus.COMPLETED]: i18n.t('Completed'),
    [plainStatus.CANCELLED]: i18n.t('Cancelled'),
});

export const eventStatuses = Object.freeze({
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    VISITED: 'VISITED',
    SCHEDULE: 'SCHEDULE',
    OVERDUE: 'OVERDUE',
    SKIPPED: 'SKIPPED',
});
