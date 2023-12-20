// @flow
import { useQuery } from 'react-query';
import log from 'loglevel';
import { useDataEngine, type ResourceQuery } from '@dhis2/app-runtime';
import type { QueryFunction, UseQueryOptions } from 'react-query';
import { IndexedDBError } from '../../../../capture-core-utils/storage/IndexedDBError/IndexedDBError';
import type { Result } from './useMetadataQuery.types';
import { ReactQueryAppNamespace, IndexedDBNamespace } from '../reactQueryHelpers.const';

const throwErrorForIndexedDB = (error) => {
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
    queryKey: Array<string | number>,
    queryFn: QueryFunction<TResultData>,
    queryOptions: UseQueryOptions<TResultData>,
): Result<TResultData> => useQuery<TResultData>([ReactQueryAppNamespace, ...queryKey], queryFn, {
    staleTime: Infinity,
    ...queryOptions,
});

export const useCustomMetadataQuery = <TResultData>(
    queryKey: Array<string | number>,
    queryFn: QueryFunction<TResultData>,
    queryOptions?: UseQueryOptions<TResultData>,
): Result<TResultData> =>
        useAsyncMetadata(queryKey, queryFn, {
            cacheTime: 5,
            ...queryOptions,
        });


export const useIndexedDBQuery = <TResultData>(
    queryKey: Array<string | number>,
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

export const useApiMetadataQuery = <TResultData>(
    queryKey: Array<string | number>,
    queryObject: ResourceQuery,
    queryOptions?: UseQueryOptions<TResultData>,
): Result<TResultData> => {
    const dataEngine = useDataEngine();
    const queryFn: QueryFunction<TResultData> = () => dataEngine.query({ theQuerykey: queryObject })
        .then(response => response.theQuerykey);
    return useAsyncMetadata(queryKey, queryFn, {
        cacheTime: Infinity,
        staleTime: Infinity,
        ...queryOptions,
    });
};
