// @flow
import type { QuerySingleResource } from '../../../../../../utils/api';
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching, TeiWorkingListsTemplate } from '../../../types';

export type Input = {|
    programId: string,
    orgUnitId: string,
    storeId: string,
    selectedTemplate: TeiWorkingListsTemplate,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
    querySingleResource: QuerySingleResource,
    absoluteApiPath: string,
|};
