import { useQuery } from 'react-query';
import log from 'loglevel';
import { useDataEngine } from '@dhis2/app-runtime';
import type { ResourceQuery } from 'capture-core-utils/types/app-runtime';
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
    queryKey: Array<string | number | any | null | undefined>,
    queryFn: QueryFunction<TResultData>,
    queryOptions: UseQueryOptions<TResultData>,
): Result<TResultData> => useQuery<TResultData>([ReactQueryAppNamespace, ...queryKey], queryFn, {
    staleTime: Infinity,
    ...queryOptions,
});

export const useCustomMetadataQuery = <TResultData>(
    queryKey: Array<string | number | any | null | undefined>,
    queryFn: QueryFunction<TResultData>,
    queryOptions?: UseQueryOptions<TResultData>,
): Result<TResultData> =>
        useAsyncMetadata(queryKey, queryFn, {
            cacheTime: 5,
            ...queryOptions,
        });


export const useIndexedDBQuery = <TResultData>(
    queryKey: Array<string | number | any | null | undefined>,
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
    queryKey: Array<string | number | any | null | undefined>,
    queryObject: ResourceQuery | undefined,
    queryOptions?: UseQueryOptions<TResultData>,
): Result<TResultData> => {
    const dataEngine = useDataEngine();
    const queryFn: QueryFunction<TResultData> = () => {
        if (!queryObject) {
            return Promise.resolve(undefined as TResultData);
        }
        return dataEngine.query({ theQuerykey: queryObject })
            .then(response => response.theQuerykey as TResultData);
    };
    
    return useAsyncMetadata(queryKey, queryFn, {
        cacheTime: Infinity,
        staleTime: Infinity,
        ...queryOptions,
    });
};
