// @flow
import type {
    ApiQuery,
    ConvertFn,
} from './IOUtils.types';

export type ExecuteOptions = {
    onConvert?: ConvertFn,
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
    onConvert?: ConvertFn,
};
