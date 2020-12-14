// @flow
import type { TeiColumnsMetaForDataFetching } from '../../../types';
import type { SingleResourceQuery } from '../../../../../../../utils/api';

export type Input = {
    programId: string,
    orgUnitId: string,
    storeId: string,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    singleResourceQuery: SingleResourceQuery,
    absoluteApiPath: string,
};
