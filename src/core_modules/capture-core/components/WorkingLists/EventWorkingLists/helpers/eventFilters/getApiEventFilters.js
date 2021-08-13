// @flow
import type { QuerySingleResource } from '../../../../../utils/api/api.types';

type ApiConfig = {
    eventFilters: Array<Object>,
    pager: Object,
};

export const getApiEventFilters = async (programId: string, querySingleResource: QuerySingleResource) => {
    const apiRes: ApiConfig = await querySingleResource({
        resource: 'eventFilters',
        params: {
            filter: `program:eq:${programId}`,
            fields: 'id,displayName,eventQueryCriteria,access,externalAccess,publicAccess,user[id,username],userAccesses[id,access],userGroupAccesses[id,access]',
        },
    });

    const configs = apiRes && apiRes.eventFilters ? apiRes.eventFilters : [];
    const processedConfigs: Array<Object> = configs
        .map(({
            id,
            displayName: name,
            eventQueryCriteria,
            access,
            externalAccess,
            publicAccess,
            user,
            userAccesses,
            userGroupAccesses,
        }) => ({
            id,
            name,
            eventQueryCriteria,
            access,
            externalAccess,
            publicAccess,
            user,
            userAccesses,
            userGroupAccesses,
        }));

    return processedConfigs;
};
