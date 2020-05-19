// @flow
import type {
    ApiQuery,
    ConvertQueryResponseFn,
} from './IOUtils.types';

export type ExecuteOptions = {
    onConvertQueryResponse?: ConvertQueryResponseFn,
};

export type Variables = {
    iteration: number,
};

export type RecursiveQuery = {
    ...ApiQuery,
    params?: (variables: Variables) => Object,
};

export type QuickStoreIterationOptions = {
    variables: Variables,
    onConvertQueryResponse?: ConvertQueryResponseFn,
};
