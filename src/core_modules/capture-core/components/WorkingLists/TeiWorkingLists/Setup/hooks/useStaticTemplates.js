// @flow
import { useMemo } from 'react';
import i18n from '@dhis2/d2-i18n';
import type { WorkingListTemplate } from '../../../WorkingListsBase';

export const useStaticTemplates = (defaultAlteredTemplate?: WorkingListTemplate) =>
    useMemo(
        () => [
            defaultAlteredTemplate || {
                id: 'default',
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
                name: i18n.t('Active enrollments'),
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
                name: i18n.t('Completed enrollments'),
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
                name: i18n.t('Cancelled enrollments'),
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
        [defaultAlteredTemplate],
    );
