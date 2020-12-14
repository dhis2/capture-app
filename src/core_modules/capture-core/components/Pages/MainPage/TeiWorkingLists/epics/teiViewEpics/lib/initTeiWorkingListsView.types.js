// @flow
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching, TeiWorkingListsTemplate } from '../../../types';
import type { SingleResourceQuery } from '../../../../../../../utils/api';

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
