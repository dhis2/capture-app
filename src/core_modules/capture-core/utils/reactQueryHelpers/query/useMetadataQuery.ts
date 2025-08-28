import { useQuery } from 'react-query';
import log from 'loglevel';
import { useDataEngine } from '@dhis2/app-runtime';
import type { QueryFunction, UseQueryOptions, QueryKey } from 'react-query';
import type { ResourceQuery } from '../../../../capture-core-utils/types/app-runtime';
import type { Result } from './useMetadataQuery.types';
import { IndexedDBError } from '../../../../capture-core-utils/storage/IndexedDBError/IndexedDBError';
import { ReactQueryAppNamespace, IndexedDBNamespace } from '../reactQueryHelpers.const';

const throwErrorForIndexedDB = (error: any) => {
    if (error instanceof IndexedDBError) {
        log.error(error.error);
    } else if (error instanceof Error) {
        log.error(error.message);
    } else {
        log.error(error);
    }
    throw Error('There was an error fetching metadata');
};

// Generic over both the raw data (TQueryFnData) and the transformed data (TData)
const useAsyncMetadata = <TQueryFnData, TData = TQueryFnData>(
    queryKey: Array<string | number | any | null | undefined>,
    queryFn: QueryFunction<TQueryFnData>,
    queryOptions: UseQueryOptions<TQueryFnData, unknown, TData, QueryKey>,
): Result<TData> =>
        useQuery<TQueryFnData, unknown, TData, QueryKey>(
            [ReactQueryAppNamespace, ...queryKey],
            queryFn,
            {
                staleTime: Infinity,
                ...queryOptions,
            },
        );

export const useCustomMetadataQuery = <TQueryFnData, TData = TQueryFnData>(
    queryKey: Array<string | number | any | null | undefined>,
    queryFn: QueryFunction<TQueryFnData>,
    queryOptions?: UseQueryOptions<TQueryFnData, unknown, TData, QueryKey>,
): Result<TData> =>
        useAsyncMetadata<TQueryFnData, TData>(queryKey, queryFn, {
            cacheTime: 5,
            ...queryOptions,
        });

export const useIndexedDBQuery = <TQueryFnData, TData = TQueryFnData>(
    queryKey: Array<string | number | any | null | undefined>,
    queryFn: QueryFunction<TQueryFnData>,
    queryOptions?: UseQueryOptions<TQueryFnData, unknown, TData, QueryKey>,
): Result<TData> =>
        useAsyncMetadata<TQueryFnData, TData>([IndexedDBNamespace, ...queryKey], queryFn, {
            cacheTime: 0,
            ...queryOptions,
            onError: (error) => {
                queryOptions?.onError && queryOptions.onError(error);
                throwErrorForIndexedDB(error);
            },
        });

export const useApiMetadataQuery = <TQueryFnData, TData = TQueryFnData>(
    queryKey: Array<string | number | any | null | undefined>,
    queryObject: ResourceQuery | undefined,
    queryOptions?: UseQueryOptions<TQueryFnData, unknown, TData, QueryKey>,
): Result<TData> => {
    const dataEngine = useDataEngine();

    const queryFn: QueryFunction<TQueryFnData> = () => {
        if (!queryObject) {
            // Returner "undefined" som TQueryFnData for å holde generics konsistente
            return Promise.resolve(undefined as unknown as TQueryFnData);
        }

        return dataEngine
            .query({ theQuerykey: queryObject })
            .then(response => response.theQuerykey as TQueryFnData);
    };

    return useAsyncMetadata<TQueryFnData, TData>(queryKey, queryFn, {
        cacheTime: Infinity,
        staleTime: Infinity,
        enabled: true,
        ...queryOptions,
    });
};
