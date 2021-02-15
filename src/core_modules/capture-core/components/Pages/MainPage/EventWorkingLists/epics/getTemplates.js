// @flow
import { getApiEventFilters } from '../helpers/eventFilters';
import type { QuerySingleResource } from '../../../../../utils/api/api.types';
import type { EventWorkingListsTemplates } from '../types';

export const getTemplates = (programId: string, querySingleResource: QuerySingleResource): Promise<{ templates: EventWorkingListsTemplates, defaultTemplateId: string}> =>
    getApiEventFilters(programId, querySingleResource).then((apiEventFilters) => {
        const defaultTemplate = {
            id: `${programId}-default`,
            isDefault: true,
            name: 'default',
            access: {
                update: false,
                delete: false,
                write: false,
                manage: false,
            },
        };

        return {
            templates: [
                defaultTemplate,
                ...(apiEventFilters
                    .map(apiEventFilter => ({
                        ...apiEventFilter,
                        criteria: apiEventFilter.eventQueryCriteria,
                        eventQueryCriteria: undefined,
                    }))
                ),
            ],
            defaultTemplateId: defaultTemplate.id,
        };
    });
