// @flow
import { getApiEventFilters } from '../helpers/eventFilters';
import type { QuerySingleResource } from '../../../../utils/api/api.types';
import type { EventWorkingListsTemplates } from '../types';
import { convertDisplayColumnOrderToClient } from '../../WorkingListsCommon/helpers/converters/convertDisplplayColumnOrder';
import { convertOrderToClient } from '../../WorkingListsCommon/helpers/converters/orderConverter';

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
                    .map((apiEventFilter) => {
                        const { displayColumnOrder, order, eventDate } = apiEventFilter.eventQueryCriteria;
                        const convertedEventQueryCriteria = {
                            ...apiEventFilter.eventQueryCriteria,
                            displayColumnOrder: convertDisplayColumnOrderToClient(displayColumnOrder),
                            order: convertOrderToClient(order),
                            occurredAt: eventDate,
                        };

                        return ({
                            ...apiEventFilter,
                            criteria: convertedEventQueryCriteria,
                            eventQueryCriteria: undefined,
                        });
                    })
                ),
            ],
            defaultTemplateId: defaultTemplate.id,
        };
    });
