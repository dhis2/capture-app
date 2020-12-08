// @flow
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching, TeiWorkingListsTemplate } from '../../../types';

export type Input = {|
    programId: string,
    orgUnitId: string,
    storeId: string,
    selectedTemplate: TeiWorkingListsTemplate,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
    singleResourceQuery: SingleResourceQuery,
    absoluteApiPath: string,
|};
