// @flow
export type ApiQuery = {
    resource: string,
    id?: string,
    data?: Object,
    params?: Object,
};

export type ApiQueryExtended = {
    resource: string,
    id?: string,
    data?: Object | (variables: Object) => Object,
    params?: Object | (variables: Object) => Object,
};

export type StoreName = string;

export type ConvertQueryResponseFn = (apiResponse: any) => any;

export type QuickStoreMandatory = {
    query: ApiQueryExtended,
    storeName: StoreName,
    convertQueryResponse: ConvertQueryResponseFn,
};
export type QuickStoreOptions = {
    queryVariables?: Object,
}

export type QuickStoreRecursivelyMandatory = {
    query: ApiQuery,
    storeName: StoreName,
    convertQueryResponse: ConvertQueryResponseFn,
};

export type QuickStoreRecursivelyOptions = {
    iterationSize?: number,
}

export interface QueryRecursivelyOptions {
    convertQueryResponse?: ConvertQueryResponseFn,
    pageSize?: number,
}
