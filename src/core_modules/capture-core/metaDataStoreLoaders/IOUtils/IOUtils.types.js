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

export type QuickStoreOptions = {
    onConvertQueryResponse?: ConvertQueryResponseFn,
    variables?: Object,
}

export interface QuickStoreRecursivelyOptions {
    onConvertQueryResponse?: ConvertQueryResponseFn,
    iterationSize?: number,
}
