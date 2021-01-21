// @flow
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

export type RecursiveQuery = {|
    ...ApiQuery,
    params?: (queryVariables: QueryVariables) => Object,
|};

export type QuickStoreIterationOptions = {
    convertQueryResponse: ConvertQueryResponseFn,
    queryVariables: QueryVariables,
};
