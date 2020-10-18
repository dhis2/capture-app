// @flow
import { getApiEventFilters } from '../helpers/eventFilters';

export const getTemplates = (programId: string) =>
    getApiEventFilters(programId).then((apiEventFilters) => {
        const defaultTemplate = {
            id: `${programId}-default`,
            isDefault: true,
            name: 'default',
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
