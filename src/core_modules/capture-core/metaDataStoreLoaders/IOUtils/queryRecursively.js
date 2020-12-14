// @flow
import type { QueryParameters, QueryVariables } from '@dhis2/app-runtime';
import { query } from './query';
import type {
    ApiQuery,
    ConvertQueryResponseFn,
    QueryRecursivelyOptions,
} from './IOUtils.types';

type Variables = {
    page: number,
};

type RecursiveQuery = {|
    ...ApiQuery,
    params?: (variables: QueryVariables) => QueryParameters,
|};

const executeRecursiveQuery = (
    recursiveQuery: RecursiveQuery,
    convertQueryResponse?: ConvertQueryResponseFn,
) => {
    const next = async (page: number = 1) => {
        // $FlowFixMe union type problem
        const response = await query(recursiveQuery, { page });
        const convertedData = convertQueryResponse ? convertQueryResponse(response) : response;
        const done = !(response && response.pager && response.pager.nextPage);

        if (!done) {
            const innerResult = await next(page + 1);
            return [convertedData, ...innerResult];
        }
        return [convertedData];
    };

    return next();
};

const getRecursiveQuery = (querySpec: ApiQuery, pageSize: number) => ({
    ...querySpec,
    params: (variables: Variables) => ({
        ...querySpec.params,
        pageSize,
        page: variables.page,
    }),
});

export const queryRecursively = (
    querySpec: ApiQuery, {
        pageSize = 500,
        convertQueryResponse,
    }: QueryRecursivelyOptions = {}) => {
    const recursiveQuery = getRecursiveQuery(querySpec, pageSize);
    return executeRecursiveQuery(recursiveQuery, convertQueryResponse);
};
