// @flow
import { quickStore } from './quickStore';
import type {
    ApiQuery,
    StoreName,
    QuickStoreRecursivelyOptions,
} from './IOUtils.types';
import type {
    Variables,
    RecursiveQuery,
    QuickStoreIterationOptions,
    ExecuteOptions,
} from './quickStoreRecursively.types';

const quickStoreIteration = async (
    recursiveQuery: RecursiveQuery,
    storeName: StoreName,
    {
        variables,
        convertQueryResponse,
    }: QuickStoreIterationOptions,
) => {
    const { rawResponse } = await quickStore(recursiveQuery, storeName, {
        convertQueryResponse,
        variables,
    });

    return !(rawResponse && rawResponse.pager && rawResponse.pager.nextPage);
};

const executeRecursiveQuickStore = (
    recursiveQuery: RecursiveQuery,
    storeName: StoreName,
    {
        convertQueryResponse,
    }: ExecuteOptions) => {
    const next = async (iteration: number = 1) => {
        const done = await quickStoreIteration(recursiveQuery, storeName, {
            convertQueryResponse,
            variables: {
                iteration,
            },
        });

        if (!done) {
            await next(iteration + 1);
        }
    };

    return next();
};

const getRecursiveQuery = (query: ApiQuery, iterationSize: number) => ({
    ...query,
    params: (variables: Variables) => ({
        ...query.params,
        pageSize: iterationSize,
        page: variables.iteration,
    }),
});

export const quickStoreRecursively = async (
    query: ApiQuery,
    storeName: StoreName,
    {
        iterationSize = 500,
        convertQueryResponse,
    }: QuickStoreRecursivelyOptions) => {
    const recursiveQuery = getRecursiveQuery(query, iterationSize);
    await executeRecursiveQuickStore(recursiveQuery, storeName, {
        convertQueryResponse,
    });
};
