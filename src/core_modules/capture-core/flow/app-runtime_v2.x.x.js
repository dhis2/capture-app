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

    declare type RefetchOptions = QueryVariables;
    declare type RefetchFunction<ReturnType> = (options?: RefetchOptions) => Promise<ReturnType>;
    declare export type QueryRefetchFunction = RefetchFunction<QueryResult>;

    declare type FetchErrorTypeName = 'network' | 'unknown' | 'access' | 'aborted';
    declare type FetchErrorDetails = { message?: string };

    declare interface FetchErrorPayload {
        type: FetchErrorTypeName,
        details?: FetchErrorDetails,
        message: string,
    }

    declare export class FetchError extends Error implements FetchErrorPayload {
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
        data?: MutationData,
    |};
    declare type UpdateMutation = {|
        ...ResourceQuery,
        type: 'update' | 'replace' | 'delete',
        id?: string | (data: Object) => string,
        partial?: boolean,
        data?: MutationData,
    |};
    declare type DeleteMutation = {|
        ...ResourceQuery,
        type: 'delete',
        id: string | (data: Object) => string,
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
        link: {| config: { baseUrl: string, apiVersion: string }, versionedApiPath: string, |};
    }
    declare export function useDataEngine(): DataEngine;

    declare type DHIS2Date = {|
        serverOffset: number;
        serverTimezone: string;
        clientTimezone: string;
        getServerZonedISOString: () => string;
        getClientZonedISOString: () => string;
    |}

    declare export function useTimeZoneConversion(): {
        fromServerDate: (date?: string | Date | number | null) => DHIS2Date;
        fromClientDate: (date?: string | Date | number | null) => DHIS2Date;
    };

    declare export function useConfig(): {|
        baseUrl: string,
        apiVersion: string,
        serverVersion: { major: number, minor: number, patch?: number },
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

    declare export function useDataMutation(mutation: Mutation, mutationOptions?: QueryOptions): MutationRenderInput;

    declare type AlertOptions = { [key: string]: mixed };

    declare export function useAlert(message: string | ((props: any) => string), options?: AlertOptions | ((props: any) => AlertOptions)): {
        show: (props?: any) => void;
        hide: () => void;
    };
}
