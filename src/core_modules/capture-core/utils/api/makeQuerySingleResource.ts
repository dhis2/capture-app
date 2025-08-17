export const makeQuerySingleResource = (query: any) =>
    async (resourceQuery: any, variables: any = {}) => {
        const resourceQueries = {
            [resourceQuery.resource]: resourceQuery,
        };
        const { [resourceQuery.resource]: resourceResponse } = await query(resourceQueries, { variables });
        return resourceResponse;
    };
