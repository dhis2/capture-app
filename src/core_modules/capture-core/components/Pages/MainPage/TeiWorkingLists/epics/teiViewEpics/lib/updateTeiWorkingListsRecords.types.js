// @flow
import type { FiltersData } from '../../../../WorkingLists';
import type { TeiColumnsMetaForDataFetching } from '../../../types';
import type { QuerySingleResource } from '../../../../../../../utils/api';

export type Input = {
    page: number,
    pageSize: number,
    programId: string,
    orgUnitId: string,
    filters: FiltersData,
    sortById: string,
    sortByDirection: string,
    storeId: string,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    querySingleResource: QuerySingleResource,
    absoluteApiPath: string,
};
