// @flow
import { useQuery } from 'react-query';
import log from 'loglevel';
import { useDataEngine, type ResourceQuery } from '@dhis2/app-runtime';
import { IndexedDBError } from '../../../../capture-core-utils/storage/StorageController';
import type { Result, Options, QueryFunction, QueryKey } from './useMetadataQuery.types';

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
    queryOptions: Options<TResultData>,
): Result<TResultData> => useQuery<TResultData>(queryKey, queryFn, {
    staleTime: Infinity,
    ...queryOptions,
});

export const useMetadataCustomQuery = <TResultData>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TResultData>, {
        cacheTime = 5,
        ...queryOptions
    }: Options<TResultData> = {},
): Result<TResultData> =>
        useAsyncMetadata(queryKey, queryFn, {
            cacheTime,
            ...queryOptions,
        });


export const useIndexedDBQuery = <TResultData>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TResultData>, {
        cacheTime = 0,
        onError,
        ...queryOptions
    }: Options<TResultData> = {},
): Result<TResultData> =>
        useAsyncMetadata(queryKey, queryFn, {
            ...queryOptions,
            cacheTime,
            onError: (error) => {
                onError?.(error);
                throwErrorForIndexedDB(error);
            },
        });

export const useMetadataApiQuery = <TResultData>(
    queryKey: QueryKey,
    queryObject: ResourceQuery, {
        cacheTime = 5,
        ...queryOptions
    }: Options<TResultData> = {},
): Result<TResultData> => {
    const dataEngine = useDataEngine();
    const queryFn: QueryFunction<TResultData> = () => dataEngine.query({ theQuerykey: queryObject })
        .then(response => response.theQuerykey);
    return useAsyncMetadata(queryKey, queryFn, {
        cacheTime,
        ...queryOptions,
    });
};
