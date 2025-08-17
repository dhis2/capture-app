import type { ResourceQuery, QueryVariables } from 'capture-core-utils/types/app-runtime';

export const makeQuerySingleResource = (query: any) =>
    async (resourceQuery: ResourceQuery, variables: QueryVariables = {}) => {
        const resourceQueries = {
            [resourceQuery.resource]: resourceQuery,
        };
        const { [resourceQuery.resource]: resourceResponse } = await query(resourceQueries, { variables });
        return resourceResponse;
    };
