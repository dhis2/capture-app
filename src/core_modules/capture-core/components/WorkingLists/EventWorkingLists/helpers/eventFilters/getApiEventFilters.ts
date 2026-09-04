import type { QuerySingleResource } from '../../../../../utils/api/api.types';

type ApiConfig = {
    eventFilters: any[];
    pager: any;
};

export const getApiEventFilters = async (programId: string, querySingleResource: QuerySingleResource) => {
    const apiRes: ApiConfig = await querySingleResource({
        resource: 'eventFilters',
        params: {
            filter: `program:eq:${programId}`,
            fields: 'id,displayName,eventQueryCriteria,access,sharing',
        },
    });

    const configs = apiRes && apiRes.eventFilters ? apiRes.eventFilters : [];
    const processedConfigs: any[] = configs
        .map(({
            id,
            displayName: name,
            eventQueryCriteria,
            access,
            sharing,
        }) => ({
            id,
            name,
            eventQueryCriteria,
            access,
            sharing,
        }));

    return processedConfigs;
};
