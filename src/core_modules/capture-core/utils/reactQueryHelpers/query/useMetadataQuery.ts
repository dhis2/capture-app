import { useQuery } from 'react-query';
import log from 'loglevel';
import { useDataEngine } from '@dhis2/app-runtime';
import type { QueryFunction, UseQueryOptions } from 'react-query';
import { IndexedDBError } from '../../../../capture-core-utils/storage/IndexedDBError/IndexedDBError';
import type { Result } from './useMetadataQuery.types';
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

const useAsyncMetadata = <TResultData>(
    queryKey: Array<string | number | any | null | void>,
    queryFn: QueryFunction<TResultData>,
    queryOptions: UseQueryOptions<TResultData>,
): Result<TResultData> => useQuery<TResultData>([ReactQueryAppNamespace, ...queryKey], queryFn, {
    staleTime: Infinity,
    ...queryOptions,
});

export const useCustomMetadataQuery = <TResultData>(
    queryKey: Array<string | number | any | null | void>,
    queryFn: QueryFunction<TResultData>,
    queryOptions?: UseQueryOptions<TResultData>,
): Result<TResultData> =>
        useAsyncMetadata(queryKey, queryFn, {
            cacheTime: 5,
            ...queryOptions,
        });


export const useIndexedDBQuery = <TResultData>(
    queryKey: Array<string | number | any | null | void>,
    queryFn: QueryFunction<TResultData>,
    queryOptions?: UseQueryOptions<TResultData>,
): Result<TResultData> =>
        useAsyncMetadata([IndexedDBNamespace, ...queryKey], queryFn, {
            cacheTime: 0,
            ...queryOptions,
            onError: (error) => {
                queryOptions?.onError && queryOptions.onError(error);
                throwErrorForIndexedDB(error);
            },
        });

export const useApiMetadataQuery = <TResultData = unknown>(
    queryKey: Array<string | number | any | null | void>,
    queryObject: any,
    queryOptions?: UseQueryOptions<TResultData>,
): Result<TResultData> => {
    const dataEngine = useDataEngine();
    const queryFn: QueryFunction<TResultData> = () => {
        if (!queryObject) {
            throw new Error('Query object is required');
        }

        const processedQuery = { ...queryObject };
        if (typeof queryObject.id === 'function') {
            processedQuery.id = queryObject.id();
        }

        return dataEngine.query({ theQuerykey: processedQuery })
            .then(response => response.theQuerykey as TResultData);
    };
    return useAsyncMetadata(queryKey, queryFn, {
        cacheTime: Infinity,
        staleTime: Infinity,
        enabled: !!queryObject,
        ...queryOptions,
    });
};
