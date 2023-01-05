// @flow
import type { UseQueryResult, UseQueryOptions } from 'react-query';

export type { QueryFunction, QueryKey } from 'react-query';

export type Result<TResultData> = UseQueryResult<TResultData>;
export type Options<TResultData> = UseQueryOptions<TResultData>;
