// @flow
import { query } from './query';
import type {
    ApiQuery,
    ConvertFn,
    QueryRecursivelyOptions,
} from './IOUtils.types';

type Variables = {
    page: number,
};

type RecursiveQuery = {
    ...ApiQuery,
    params?: (variables: Variables) => Object,
};

const executeRecursiveQuery = (
    recursiveQuery: RecursiveQuery,
    onConvert?: ConvertFn,
) => {
    const next = async (page: number = 1) => {
        const response = await query(recursiveQuery, { page });
        const convertedData = onConvert ? onConvert(response) : response;
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
        onConvert,
    }: QueryRecursivelyOptions = {}) => {
    const recursiveQuery = getRecursiveQuery(querySpec, pageSize);
    return executeRecursiveQuery(recursiveQuery, onConvert);
};
