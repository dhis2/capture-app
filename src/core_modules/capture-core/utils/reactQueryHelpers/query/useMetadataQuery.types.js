// @flow
import type { UseQueryOptions, UseQueryResult } from 'react-query';
import type { ResourceQuery } from '@dhis2/app-runtime';

export type ApiMetadataProps<TResultData> = {|
    queryKey: string | Array<string>,
    QueryObject: ResourceQuery,
    queryOptions?: UseQueryOptions<TResultData>,
|}

export type Result<TResultData> = UseQueryResult<TResultData>;
