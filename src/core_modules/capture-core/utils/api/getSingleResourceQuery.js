// @flow
export const getSingleResourceQuery = (query: DataEngineQuery) =>
    async (resourceQuery: ResourceQuery, variables?: QueryVariables = {}) => {
        const resourceQueries = {
            [resourceQuery.resource]: resourceQuery,
        };
        const { [resourceQuery.resource]: resourceResponse } = await query(resourceQueries, { variables });
        return resourceResponse;
    };
