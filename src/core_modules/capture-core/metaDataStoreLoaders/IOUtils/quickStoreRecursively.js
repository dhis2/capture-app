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
  QueryVariables,
  RecursiveQuery,
  QuickStoreIterationOptions,
} from './quickStoreRecursively.types';

const quickStoreIteration = async (
  recursiveQuery: RecursiveQuery,
  storeName: StoreName,
  { convertQueryResponse, queryVariables }: QuickStoreIterationOptions,
) => {
  const { rawResponse } = await quickStore(
    {
      query: recursiveQuery,
      storeName,
      convertQueryResponse,
    },
    {
      queryVariables,
    },
  );

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
      queryVariables: {
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
  params: (queryVariables: QueryVariables) => ({
    ...query.params,
    pageSize: iterationSize,
    page: queryVariables.iteration,
  }),
});

export const quickStoreRecursively = (
  { query, storeName, convertQueryResponse }: QuickStoreRecursivelyMandatory,
  { iterationSize = 500 }: QuickStoreRecursivelyOptions = {},
) => {
  const recursiveQuery = getRecursiveQuery(query, iterationSize);
  return executeRecursiveQuickStore(recursiveQuery, storeName, convertQueryResponse);
};
