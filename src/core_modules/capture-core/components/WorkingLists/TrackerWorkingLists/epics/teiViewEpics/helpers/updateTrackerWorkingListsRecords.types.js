// @flow
import type { FiltersData } from '../../../../WorkingListsBase';
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching } from '../../../types';
import type { QuerySingleResource } from '../../../../../../utils/api';

export type Input = {|
    page: number,
    pageSize: number,
    programId: string,
    programStageId?: string,
    orgUnitId: string,
    filters: FiltersData,
    sortById: string,
    sortByDirection: string,
    storeId: string,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
    querySingleResource: QuerySingleResource,
    absoluteApiPath: string,
|};
