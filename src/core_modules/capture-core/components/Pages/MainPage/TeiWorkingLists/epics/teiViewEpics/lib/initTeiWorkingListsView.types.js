// @flow
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching } from '../../../types';
import type { SingleResourceQuery } from '../../../../../../../utils/api';

export type Input = {|
    programId: string,
    orgUnitId: string,
    storeId: string,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
    singleResourceQuery: SingleResourceQuery,
    absoluteApiPath: string,
|};
