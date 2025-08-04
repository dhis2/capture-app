// @flow
import { getApiEventFilters } from '../helpers/eventFilters';
import type { QuerySingleResource } from '../../../../utils/api/api.types';
import type { EventWorkingListsTemplates, MainViewConfig } from '../types';

export const getTemplates = (programId: string, querySingleResource: QuerySingleResource, mainViewConfig: MainViewConfig): Promise<{ templates: EventWorkingListsTemplates, defaultTemplateId: string}> =>
    getApiEventFilters(programId, querySingleResource).then((apiEventFilters) => {
        const defaultEventFilter = {
            id: `${programId}-default`,
            isDefault: true,
            name: 'default',
            access: {
                update: false,
                delete: false,
                write: false,
                manage: false,
            },
            eventQueryCriteria: mainViewConfig || {},
        };
        return {
            templates: [...apiEventFilters, defaultEventFilter]
                .map(({ eventQueryCriteria, ...eventFilter }) => {
                    const { displayColumnOrder, order, eventDate, ...criteria } = eventQueryCriteria;
                    const convertedEventQueryCriteria = {
                        ...criteria,
                        displayColumnOrder: displayColumnOrder?.map(columnId => (columnId === 'eventDate' ? 'occurredAt' : columnId)),
                        order: order?.includes('eventDate') ? order.replace('eventDate', 'occurredAt') : order,
                        occurredAt: eventDate,
                    };

                    return ({
                        ...eventFilter,
                        criteria: convertedEventQueryCriteria,
                    });
                }),
            defaultTemplateId: defaultEventFilter.id,
        };
    });
