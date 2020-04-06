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

export type ConvertFn = (apiResponse: any) => any;

export type QuickStoreOptions = {
    onConvert?: ConvertFn,
    variables?: Object,
}

export type GetResultLengthFn = (rawResponse: any) => number;

export interface QuickStoreRecursivelyOptions {
    onConvert?: ConvertFn,
    onGetResultLength?: GetResultLengthFn,
    iterationSize?: number,
}
