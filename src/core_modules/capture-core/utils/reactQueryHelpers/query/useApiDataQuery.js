// @flow
import { useQuery } from 'react-query';
import { useDataEngine, type ResourceQuery } from '@dhis2/app-runtime';
import type { QueryFunction, UseQueryOptions } from 'react-query';
import type { Result } from './useMetadataQuery.types';
import { ReactQueryAppNamespace } from '../reactQueryHelpers.const';

export const useApiDataQuery = <TResultData>(
    queryKey: Array<string | number | Object | null | void>,
    queryObject: ResourceQuery,
    queryOptions: UseQueryOptions<TResultData>,
): Result<TResultData> => {
    const dataEngine = useDataEngine();
    const queryFn: QueryFunction<TResultData> = () => dataEngine.query({ theQuerykey: queryObject })
        .then(response => response.theQuerykey);
    return useQuery<TResultData>(
        [ReactQueryAppNamespace, ...queryKey],
        queryFn,
        {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            staleTime: 2 * 60 * 1000,
            cacheTime: 5 * 60 * 1000,
            ...queryOptions,
        });
};
