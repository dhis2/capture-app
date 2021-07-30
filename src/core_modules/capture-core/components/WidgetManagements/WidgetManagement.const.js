// @flow
import i18n from '@dhis2/d2-i18n';

export const ManagementStatuses = Object.freeze({
    open: 'Open',
    performed: 'Performed',
    notperformed: 'Not Performed',
});

export const TranslatedManagementStatuses = Object.freeze({
    open: i18n.t('Open'),
    performed: i18n.t('Performed'),
    notperformed: i18n.t('Not Performed'),
});
