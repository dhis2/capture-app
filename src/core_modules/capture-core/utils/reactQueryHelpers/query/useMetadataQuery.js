// @flow
import { useQuery } from 'react-query';
import type { QueryFunction, QueryKey } from 'react-query';
import type { CustomOptions, Result } from './useMetadataQuery.types';

const useAsyncMetadata = <TResultData>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TResultData>,
    { cacheTime, enabled }): Result<TResultData> => useQuery<TResultData>(queryKey, queryFn, {
        enabled,
        cacheTime,
        staleTime: Infinity,
    });

export const useMetadataCustomQuery = <TResultData>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TResultData>, {
        cacheTime = 0,
        enabled = true,
    }: CustomOptions = {}): Result<TResultData> =>
        useAsyncMetadata(queryKey, queryFn, { cacheTime, enabled });

export const useIndexedDBQuery = <TResultData>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TResultData>,
): Result<TResultData> =>
        useMetadataCustomQuery(queryKey, queryFn);
