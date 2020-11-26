// @flow
import { getApi } from '../../../../../../d2/d2Instance';

type ApiConfig = {
    eventFilters: Array<Object>,
    pager: Object,
};

export const getApiEventFilters = async (programId: string) => {
    const api = getApi();
    const apiRes: ApiConfig = await api.get(
        'eventFilters',
        {
            filter: `program:eq:${programId}`,
            fields: 'id, displayName,eventQueryCriteria,access',
        },
    );
    const configs = apiRes && apiRes.eventFilters ? apiRes.eventFilters : [];
    const processedConfigs: Array<Object> = configs
        .map(c => ({
            ...c,
            name: c.displayName,
        }));

    return processedConfigs;
};
