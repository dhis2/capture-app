// @flow
import type { TeiColumnsMetaForDataFetchingArray } from './types';

export type InputMeta = {|
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetchingArray,
    singleResourceQuery: SingleResourceQuery,
    absoluteApiPath: string,
|};
