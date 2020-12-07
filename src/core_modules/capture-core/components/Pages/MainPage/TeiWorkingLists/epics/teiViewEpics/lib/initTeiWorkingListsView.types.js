// @flow
import type { TeiColumnsMetaForDataFetching } from '../../../types';

export type Input = {
    programId: string,
    orgUnitId: string,
    storeId: string,
    columnsMetaForDataFetching: TeiColumnsMetaForDataFetching,
    singleResourceQuery: SingleResourceQuery,
    absoluteApiPath: string,
};
