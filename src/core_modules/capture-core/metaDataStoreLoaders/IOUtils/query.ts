import { getContext } from '../context';

type ResourceQuery = any;
type QueryVariables = any;

export const query = (
    resourceQuery: ResourceQuery,
    variables?: QueryVariables,
) => {
    const { onQueryApi } = getContext();
    return onQueryApi(resourceQuery, variables);
};
