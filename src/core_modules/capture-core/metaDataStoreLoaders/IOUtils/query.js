// @flow
import type { ResourceQuery, QueryVariables } from '@dhis2/app-runtime';
import { getContext } from '../context';

export const query = (
    resourceQuery: ResourceQuery,
    variables?: QueryVariables,
) => {
    const { onQueryApi } = getContext();
    return onQueryApi(resourceQuery, variables);
};
