import { useQuery } from 'react-query';
import { useDataEngine } from '@dhis2/app-runtime';
import type { QueryFunction, UseQueryOptions } from 'react-query';
import type { Result } from './useMetadataQuery.types';
import { ReactQueryAppNamespace } from '../reactQueryHelpers.const';

export const useApiDataQuery = <TQueryData = unknown, TError = unknown, TData = TQueryData>(
    queryKey: Array<string | number | any | null | void>,
    queryObject: any,
    queryOptions: UseQueryOptions<TQueryData, TError, TData>,
): Result<TData> => {
    const dataEngine = useDataEngine();
    const queryFn: QueryFunction<TQueryData> = () => {
        const processedQuery = { ...queryObject };
        if (typeof queryObject.id === 'function') {
            processedQuery.id = queryObject.id();
        }

        return dataEngine.query({ theQuerykey: processedQuery })
            .then(response => response.theQuerykey as TQueryData);
    };
    return useQuery<TQueryData, TError, TData>(
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
