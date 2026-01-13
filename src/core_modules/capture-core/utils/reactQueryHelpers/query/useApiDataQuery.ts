import { useQuery } from '@tanstack/react-query';
import { useDataEngine } from '@dhis2/app-runtime';
import type { QueryFunction, UseQueryOptions } from '@tanstack/react-query';
import type { ResourceQuery } from 'capture-core-utils/types/app-runtime';
import type { Result } from './useMetadataQuery.types';
import { ReactQueryAppNamespace } from '../reactQueryHelpers.const';

export const useApiDataQuery = <TResultData>(
    queryKey: Array<string | number | any | null | undefined>,
    queryObject: ResourceQuery | undefined,
    queryOptions: UseQueryOptions<TResultData>,
): Result<TResultData> => {
    const dataEngine = useDataEngine();
    const queryFn: QueryFunction<TResultData> = () => {
        if (!queryObject) {
            return Promise.resolve(undefined as TResultData);
        }
        return dataEngine.query({ theQuerykey: queryObject })
            .then(response => response.theQuerykey as TResultData);
    };

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
