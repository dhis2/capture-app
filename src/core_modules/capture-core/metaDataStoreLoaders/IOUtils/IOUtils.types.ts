import type { ResourceQuery } from 'capture-core-utils/types/app-runtime';

export type ApiQuery = {
    resource: string,
    id?: string,
    data?: any,
    params?: any,
};

export type StoreName = string;

export type ConvertQueryResponseFn = (apiResponse: any) => any;

export type QuickStoreMandatory = {
    query: ResourceQuery,
    storeName: StoreName,
    convertQueryResponse: ConvertQueryResponseFn,
};
export type QuickStoreOptions = {
    queryVariables?: any,
};

export type QuickStoreRecursivelyMandatory = {
    query: ApiQuery,
    storeName: StoreName,
    convertQueryResponse: ConvertQueryResponseFn,
};

export type QuickStoreRecursivelyOptions = {
    iterationSize?: number,
};

export type QueryRecursivelyOptions = {
    convertQueryResponse?: ConvertQueryResponseFn,
    pageSize?: number,
};
