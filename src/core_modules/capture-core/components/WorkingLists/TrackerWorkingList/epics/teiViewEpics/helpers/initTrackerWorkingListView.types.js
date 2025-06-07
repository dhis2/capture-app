// @flow
import type { TeiColumnsMetaForDataFetching, TeiFiltersOnlyMetaForDataFetching, TrackerWorkingListTemplate } from '../../../types';
import type { QuerySingleResource } from '../../../../../../utils/api';

export type Input = {|
    programId: string,
    orgUnitId: string,
    storeId: string,
    selectedTemplate: TrackerWorkingListTemplate,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    filtersOnlyMetaForDataFetching: TeiFiltersOnlyMetaForDataFetching,
    querySingleResource: QuerySingleResource,
    absoluteApiPath: string,
|};
