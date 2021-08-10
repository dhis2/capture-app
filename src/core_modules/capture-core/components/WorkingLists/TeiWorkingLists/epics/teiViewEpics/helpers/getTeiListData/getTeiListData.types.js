// @flow
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching } from '../../../../types';
import type { QuerySingleResource } from '../../../../../../../utils/api';

export type InputMeta = {|
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
    querySingleResource: QuerySingleResource,
    absoluteApiPath: string,
|};
