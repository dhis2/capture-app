import { useMemo } from 'react';
import type { WorkingListTemplate } from '../../../WorkingListsBase';
import { useTermLabel } from '../../../../../metaData';
import { tCustomTerm } from '../../../../../utils/tCustomTerm';

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
                name: tCustomTerm('Active {{enrollmentsLabel}}', { enrollmentsLabel }),
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
                name: tCustomTerm('Completed {{enrollmentsLabel}}', { enrollmentsLabel }),
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
                name: tCustomTerm('Cancelled {{enrollmentsLabel}}', { enrollmentsLabel }),
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
