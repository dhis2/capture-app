// @flow
import { getApiEventFilters } from '../helpers/eventFilters';
import type { EventWorkingListsTemplates } from '../types';

export const getTemplates = (
  programId: string,
): Promise<{
  templates: EventWorkingListsTemplates,
  defaultTemplateId: string,
}> =>
  getApiEventFilters(programId).then((apiEventFilters) => {
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
        ...apiEventFilters.map((apiEventFilter) => ({
          ...apiEventFilter,
          criteria: apiEventFilter.eventQueryCriteria,
          eventQueryCriteria: undefined,
        })),
      ],
      defaultTemplateId: defaultTemplate.id,
    };
  });
