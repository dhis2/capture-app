// @flow
import type { TeiColumnsMetaForDataFetching } from '../../../../types';
import type { SingleResourceQuery } from '../../../../../../../../utils/api';

export type InputMeta = {|
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    singleResourceQuery: SingleResourceQuery,
    absoluteApiPath: string,
|};
