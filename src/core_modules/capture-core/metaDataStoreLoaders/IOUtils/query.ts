import type { ResourceQuery, QueryVariables } from 'capture-core-utils/types/app-runtime';
import { getContext } from '../context';

export const query = (
    resourceQuery: ResourceQuery,
    variables?: QueryVariables,
) => {
    const { onQueryApi } = getContext();
    return onQueryApi(resourceQuery, variables);
};
