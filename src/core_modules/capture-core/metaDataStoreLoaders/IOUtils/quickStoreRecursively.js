// @flow
import { quickStore } from './quickStore';
import type {
    ApiQuery,
    StoreName,
    QuickStoreRecursivelyMandatory,
    QuickStoreRecursivelyOptions,
    ConvertQueryResponseFn,
} from './IOUtils.types';
import type {
    Variables,
    RecursiveQuery,
    QuickStoreIterationOptions,
} from './quickStoreRecursively.types';

const quickStoreIteration = async (
    recursiveQuery: RecursiveQuery,
    storeName: StoreName,
    {
        convertQueryResponse,
        variables,
    }: QuickStoreIterationOptions,
) => {
    const { rawResponse } = await quickStore({
        query: recursiveQuery,
        storeName,
        convertQueryResponse,
    }, {
        variables,
    });

    return !(rawResponse && rawResponse.pager && rawResponse.pager.nextPage);
};

const executeRecursiveQuickStore = (
    recursiveQuery: RecursiveQuery,
    storeName: StoreName,
    convertQueryResponse: ConvertQueryResponseFn,
) => {
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

export const quickStoreRecursively = ({
    query,
    storeName,
    convertQueryResponse,
}: QuickStoreRecursivelyMandatory, {
    iterationSize = 500,
}: QuickStoreRecursivelyOptions = {}) => {
    const recursiveQuery = getRecursiveQuery(query, iterationSize);
    return executeRecursiveQuickStore(recursiveQuery, storeName, convertQueryResponse);
};
