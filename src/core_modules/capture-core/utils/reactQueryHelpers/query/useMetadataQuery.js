// @flow
import { useQuery } from 'react-query';
import type { QueryKey, QueryFunction } from 'react-query';
import type { CustomOptions, Result } from './useMetadataQuery.types';

const useAsyncMetadata = <TResultData>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TResultData>,
    { cacheTime, enabled }): Result<TResultData> => {
    const { data, isLoading, isError } = useQuery<TResultData>(queryKey, queryFn, {
        enabled,
        cacheTime,
        staleTime: Infinity,
    });

    return {
        data,
        loading: isLoading,
        failed: isError,
    };
};

export const useMetadataCustomQuery = <TResultData>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TResultData>, {
        cacheTime = 0,
        enabled = true,
    }: CustomOptions = {}): Result<TResultData> =>
        useAsyncMetadata(queryKey, queryFn, { cacheTime, enabled });
