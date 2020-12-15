// @flow
import type { TeiColumnsMetaForDataFetching } from '../../../types';
import type { QuerySingleResource } from '../../../../../../../utils/api';

export type Input = {
    programId: string,
    orgUnitId: string,
    storeId: string,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    querySingleResource: QuerySingleResource,
    absoluteApiPath: string,
};
