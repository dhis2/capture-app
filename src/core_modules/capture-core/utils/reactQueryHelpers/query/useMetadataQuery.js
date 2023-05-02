// @flow
import { useQuery } from 'react-query';
import log from 'loglevel';
import { useDataEngine, type ResourceQuery } from '@dhis2/app-runtime';
import type { QueryFunction, QueryKey, UseQueryOptions } from 'react-query';
import { IndexedDBError } from '../../../../capture-core-utils/storage/IndexedDBError/IndexedDBError';
import type { Result } from './useMetadataQuery.types';

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
    queryKey: QueryKey,
    queryFn: QueryFunction<TResultData>,
    queryOptions: UseQueryOptions<TResultData>,
): Result<TResultData> => useQuery<TResultData>(queryKey, queryFn, {
    staleTime: Infinity,
    ...queryOptions,
});

export const useMetadataCustomQuery = <TResultData>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TResultData>,
    queryOptions?: UseQueryOptions<TResultData>,
): Result<TResultData> =>
        useAsyncMetadata(queryKey, queryFn, {
            cacheTime: 5,
            ...queryOptions,
        });


export const useIndexedDBQuery = <TResultData>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TResultData>,
    queryOptions?: UseQueryOptions<TResultData>,
): Result<TResultData> =>
        useAsyncMetadata(queryKey, queryFn, {
            cacheTime: 0,
            ...queryOptions,
            onError: (error) => {
                queryOptions?.onError && queryOptions.onError(error);
                throwErrorForIndexedDB(error);
            },
        });

export const useMetadataApiQuery = <TResultData>(
    queryKey: QueryKey,
    queryObject: ResourceQuery,
    queryOptions?: UseQueryOptions<TResultData>,
): Result<TResultData> => {
    const dataEngine = useDataEngine();
    const queryFn: QueryFunction<TResultData> = () => dataEngine.query({ theQuerykey: queryObject })
        .then(response => response.theQuerykey);
    return useAsyncMetadata(queryKey, queryFn, {
        // TODO: What do you think is sensible here?
        cacheTime: Infinity,
        staleTime: Infinity,
        ...queryOptions,
    });
};
