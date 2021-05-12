declare module '@dhis2/app-runtime' {
    declare export type QueryVariables = { [string]: any };

    declare type QueryParameterSingularValue = ?(string | number | boolean);
    declare type QueryParameterAliasedValue = {
        [name: string]: QueryParameterSingularValue,
    };
    declare type QueryParameterSingularOrAliasedValue =
        | QueryParameterSingularValue
        | QueryParameterAliasedValue;
    declare type QueryParameterMultipleValue = Array<QueryParameterSingularOrAliasedValue>;
    declare type QueryParameterValue =
        | QueryParameterSingularValue
        | QueryParameterAliasedValue
        | QueryParameterMultipleValue;
    declare export type QueryParameters = {
        [key: string]: QueryParameterValue
    };

    declare export type ResourceQuery = {|
        resource: string,
        id?: string | (variables: QueryVariables) => string,
        data?: any | (variables: QueryVariables) => any,
        params?: QueryParameters | (variables: QueryVariables) => QueryParameters,
    |};
    declare type ResourceQueries = {|
        [resourceId: string]: ResourceQuery,
    |};

    declare type QueryResult = any;

    declare type RefetchOptions = {|
        variables?: QueryVariables
    |};
    declare type RefetchFunction<ReturnType> = (options?: RefetchOptions) => Promise<ReturnType>;
    declare type QueryRefetchFunction = RefetchFunction<QueryResult>;

    declare type FetchErrorTypeName = 'network' | 'unknown' | 'access' | 'aborted';
    declare type FetchErrorDetails = { message?: string };

    declare interface FetchErrorPayload {
        type: FetchErrorTypeName,
        details?: FetchErrorDetails,
        message: string,
    }

    declare class FetchError extends Error implements FetchErrorPayload {
        type: FetchErrorTypeName;
        details: FetchErrorDetails;
    }

    declare type QueryOptions = {|
        variables?: QueryVariables,
        onComplete?: (data: QueryResult) => void,
        onError?: (error: FetchError) => void,
        lazy?: boolean,
    |};
    declare export type Query =
        (resourceQueries: ResourceQueries, options?: QueryOptions) =>
            Promise<{| [resourceId: string]: QueryResult |}>;

    declare type MutationData = {|
        [key: string]: any,
    |};
    declare type CreateMutation = {|
        ...ResourceQuery,
        type: 'create',
        data: MutationData,
    |};
    declare type UpdateMutation = {|
        ...ResourceQuery,
        type: 'update' | 'replace',
        id: string,
        partial?: boolean,
        data: MutationData,
    |};
    declare type DeleteMutation = {|
        ...ResourceQuery,
        type: 'delete',
        id: string,
    |};
    declare type Mutation = CreateMutation | UpdateMutation | DeleteMutation;
    declare type MutationOptions = {|
        variables?: QueryVariables,
        onError?: (error: FetchError) => any,
        onComplete?: (data: any) => any,
    |};
    declare type Mutate = (mutation: Mutation, options?: MutationOptions) => Promise<any>;

    declare class DataEngine {
        query: Query;
        mutate: Mutate;
        link: {| baseUrl: string, apiPath: string, apiVersion: string |};
    }
    declare export function useDataEngine(): DataEngine;

    declare export function useConfig(): {|
        baseUrl: string,
        apiVersion: string,
    |};

    declare export type ApiNetworkError = {|
        type: 'network',
        message: string,
        details: any,
    |};
    
    declare export type ApiAccessError = {|
        type: 'access',
        message: string,
        details: {
            httpStatus: string,
            httpStatusCode: number,
            message: string,
            status: string,
        },
    |};
    
    declare export type ApiUnknownError = {|
        type: 'unknown',
        message: string,
        details: any,
    |};
    
    declare export type ApiError = ApiNetworkError | ApiAccessError | ApiUnknownError;
    
    declare type QueryRenderInput = {|
        called: boolean,
        loading: boolean,
        error?: FetchError,
        data: QueryResult,
        engine: DataEngine,
        refetch: QueryRefetchFunction,
    |};

    declare export function useDataQuery(resourceQueries: ResourceQueries, queryOptions?: QueryOptions): QueryRenderInput;
}
