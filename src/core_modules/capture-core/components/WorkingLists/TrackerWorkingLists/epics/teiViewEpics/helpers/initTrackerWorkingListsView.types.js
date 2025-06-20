// @flow
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching, TrackerWorkingListsTemplate } from '../../../types';
import type { QuerySingleResource } from '../../../../../../utils/api';

export type Input = {|
    programId: string,
    orgUnitId: string,
    storeId: string,
    selectedTemplate: TrackerWorkingListsTemplate,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
    querySingleResource: QuerySingleResource,
    absoluteApiPath: string,
|};
