import type { ResourceQuery, QueryVariables } from '@dhis2/app-runtime';
import type { QuerySingleResource } from './api.types';

export const makeQuerySingleResource = (query: ResourceQuery): QuerySingleResource =>
    async (resourceQuery: ResourceQuery, variables: QueryVariables = {}) => {
        const resourceQueries = {
            [resourceQuery.resource]: resourceQuery,
        };
        const { [resourceQuery.resource]: resourceResponse } = await query(resourceQueries, { variables });
        return resourceResponse;
    };
