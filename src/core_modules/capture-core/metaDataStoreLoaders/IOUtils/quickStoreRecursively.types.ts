import type {
    ApiQuery,
    ConvertQueryResponseFn,
} from './IOUtils.types';

export type ExecuteOptions = {
    convertQueryResponse: ConvertQueryResponseFn,
};

export type QueryVariables = {
    iteration: number,
};

export type RecursiveQuery = {
    params?: (queryVariables: QueryVariables) => any,
} & ApiQuery;

export type QuickStoreIterationOptions = {
    convertQueryResponse: ConvertQueryResponseFn,
    queryVariables: QueryVariables,
};
