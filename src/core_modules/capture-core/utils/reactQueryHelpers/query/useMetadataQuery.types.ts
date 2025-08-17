import type { UseQueryOptions, UseQueryResult } from 'react-query';
import type { ResourceQuery } from 'capture-core-utils/types/app-runtime';

export type ApiMetadataProps<TResultData> = {
    queryKey: string | Array<string>;
    QueryObject: ResourceQuery;
    queryOptions?: UseQueryOptions<TResultData>;
};

export type Result<TResultData> = UseQueryResult<TResultData>;
