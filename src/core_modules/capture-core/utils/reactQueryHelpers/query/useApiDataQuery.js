// @flow
import { useQuery } from 'react-query';
import { useDataEngine, type ResourceQuery } from '@dhis2/app-runtime';
import type { QueryFunction, QueryKey, UseQueryOptions } from 'react-query';
import type { Result } from './useMetadataQuery.types';

export const useApiDataQuery = <TResultData>(
    queryKey: QueryKey,
    queryObject: ResourceQuery,
    queryOptions: UseQueryOptions<TResultData>,
): Result<TResultData> => {
    const dataEngine = useDataEngine();
    const queryFn: QueryFunction<TResultData> = () => dataEngine.query({ theQuerykey: queryObject })
        .then(response => response.theQuerykey);
    return useQuery<TResultData>(
        queryKey,
        queryFn,
        {
            ...queryOptions,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            staleTime: 3,
            cacheTime: 5,
        });
};
