import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import type { WorkingListTemplate } from '../../../WorkingListsBase';
import { useTermLabel } from '../../../../../metaData';

export const useStaticTemplates = (defaultAlteredTemplate: WorkingListTemplate | undefined, defaultTemplateId: string) => {
    const enrollmentsLabel = useTermLabel('enrollment', { plural: true });
    return useMemo(
        () => [
            defaultAlteredTemplate || {
                id: defaultTemplateId,
                isDefault: true,
                name: 'default',
                access: {
                    update: false,
                    delete: false,
                    write: false,
                    manage: false,
                },
            },
            {
                id: 'active',
                name: i18n.t('Active {{enrollmentsLabel}}', { enrollmentsLabel }),
                order: 1,
                access: {
                    update: false,
                    delete: false,
                    write: false,
                    manage: false,
                },
                criteria: {
                    programStatus: 'ACTIVE',
                },
            },
            {
                id: 'complete',
                name: i18n.t('Completed {{enrollmentsLabel}}', { enrollmentsLabel }),
                order: 2,
                access: {
                    update: false,
                    delete: false,
                    write: false,
                    manage: false,
                },
                criteria: {
                    programStatus: 'COMPLETED',
                },
            },
            {
                id: 'cancelled',
                name: i18n.t('Cancelled {{enrollmentsLabel}}', { enrollmentsLabel }),
                order: 3,
                access: {
                    update: false,
                    delete: false,
                    write: false,
                    manage: false,
                },
                criteria: {
                    programStatus: 'CANCELLED',
                },
            },
        ],
        [defaultAlteredTemplate, defaultTemplateId, enrollmentsLabel],
    );
};
