// @flow
import { useQuery } from 'react-query';
import log from 'loglevel';
import type { QueryFunction, QueryKey, UseQueryOptions } from 'react-query';
import type { Result } from './useMetadataQuery.types';
import { IndexedDBError } from '../../../../capture-core-utils/storage/StorageController';

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

export const useIndexedDBQuery = <TResultData>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TResultData>,
    queryOptions: UseQueryOptions<TResultData>,
): Result<TResultData> =>
        useAsyncMetadata(queryKey, queryFn, {
            cacheTime: 0,
            ...queryOptions,
            onError: (error) => {
                queryOptions?.onError && queryOptions.onError(error);
                throwErrorForIndexedDB(error);
            },
        });
