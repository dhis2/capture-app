// @flow
import type { Query, ResourceQuery, QueryVariables } from '@dhis2/app-runtime';

export const makeQuerySingleResource = (query: Query) =>
    async (resourceQuery: ResourceQuery, variables?: QueryVariables = {}) => {
        const resourceQueries = {
            [resourceQuery.resource]: resourceQuery,
        };
        const { [resourceQuery.resource]: resourceResponse } = await query(resourceQueries, { variables });
        return resourceResponse;
    };
