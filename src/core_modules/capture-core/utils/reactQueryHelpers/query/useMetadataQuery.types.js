// @flow
import type { UseQueryResult } from 'react-query';

export type CustomOptions = $ReadOnly<{|
    useCache?: boolean,
    enabled?: boolean,
|}>;

export type Result<TResultData> = UseQueryResult<TResultData>;
