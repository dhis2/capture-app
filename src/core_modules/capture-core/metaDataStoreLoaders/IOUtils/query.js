// @flow
import { getContext } from '../context';

export const query = (
    querySpecification: ResourceQuery,
    variables?: QueryVariables,
) => {
    const { onQueryApi } = getContext();
    return onQueryApi(querySpecification, variables);
};
