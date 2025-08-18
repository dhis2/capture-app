import type { UseQueryOptions, UseQueryResult } from 'react-query';

export type ApiMetadataProps<TResultData> = {
    queryKey: string | Array<string>;
    QueryObject: any;
    queryOptions?: UseQueryOptions<TResultData>;
};

export type Result<TResultData> = UseQueryResult<TResultData>;
