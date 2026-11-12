import { quickStore } from './quickStore';
import type {
    ApiQuery,
    StoreName,
    QuickStoreRecursivelyMandatory,
    QuickStoreRecursivelyOptions,
    ConvertQueryResponseFn,
} from './IOUtils.types';
import type {
    QueryVariables,
    RecursiveQuery,
    QuickStoreIterationOptions,
} from './quickStoreRecursively.types';

const quickStoreIteration = async (
    recursiveQuery: RecursiveQuery,
    storeName: StoreName,
    {
        convertQueryResponse,
        queryVariables,
    }: QuickStoreIterationOptions,
) => {
    const { rawResponse } = await quickStore({
        query: recursiveQuery,
        storeName,
        convertQueryResponse,
    }, {
        queryVariables,
    });

    return rawResponse?.pager;
};

const getRemainingIterations = (pageCount: number) =>
    Array.from({ length: pageCount - 1 }, (_, index) => index + 2);

const executeRecursiveQuickStore = async (
    recursiveQuery: RecursiveQuery,
    storeName: StoreName,
    convertQueryResponse: ConvertQueryResponseFn,
) => {
    const storeIteration = (iteration: number) => quickStoreIteration(recursiveQuery, storeName, {
        convertQueryResponse,
        queryVariables: {
            iteration,
        },
    });

    const next = async (iteration: number) => {
        const pager = await storeIteration(iteration);
        if (pager?.nextPage) {
            await next(iteration + 1);
        }
    };

    const firstPager = await storeIteration(1);
    if (!firstPager?.nextPage) {
        return;
    }

    if (firstPager.pageCount) {
        await Promise.all(getRemainingIterations(firstPager.pageCount).map(storeIteration));
        return;
    }

    await next(2);
};

const getRecursiveQuery = (query: ApiQuery, iterationSize: number) => ({
    ...query,
    params: (queryVariables: QueryVariables) => ({
        ...query.params,
        pageSize: iterationSize,
        page: queryVariables.iteration,
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
