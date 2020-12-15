// @flow
import type { TeiColumnsMetaForDataFetching } from '../../../../types';
import type { QuerySingleResource } from '../../../../../../../../utils/api';

export type InputMeta = {|
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    querySingleResource: QuerySingleResource,
    absoluteApiPath: string,
|};
