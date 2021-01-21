// @flow
import type { ResourceQuery } from '@dhis2/app-runtime';

export type ApiQuery = {|
    resource: string,
    id?: string,
    data?: Object,
    params?: Object,
|};

export type StoreName = string;

export type ConvertQueryResponseFn = (apiResponse: any) => any;

export type QuickStoreMandatory = {|
    query: ResourceQuery,
    storeName: StoreName,
    convertQueryResponse: ConvertQueryResponseFn,
|};
export type QuickStoreOptions = {|
    queryVariables?: Object,
|};

export type QuickStoreRecursivelyMandatory = {|
    query: ApiQuery,
    storeName: StoreName,
    convertQueryResponse: ConvertQueryResponseFn,
|};

export type QuickStoreRecursivelyOptions = {|
    iterationSize?: number,
|};

export type QueryRecursivelyOptions = {|
    convertQueryResponse?: ConvertQueryResponseFn,
    pageSize?: number,
|};
