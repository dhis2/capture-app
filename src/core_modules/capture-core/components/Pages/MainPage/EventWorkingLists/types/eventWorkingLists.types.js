// @flow
import { typeof dataElementTypes } from '../../../../../metaData';
import type { CustomColumnOrder } from '../../WorkingListsCommon';

export type ColumnMetaForDataFetching = {
    id: string,
    type: $Values<dataElementTypes>,
    apiName?: string,
    isMainProperty?: boolean,
};

export type ColumnsMetaForDataFetching = Map<string, ColumnMetaForDataFetching>;

export type ClientConfig = {|
    filters: { [id: string]: any },
    sortById: string,
    sortByDirection: string,
    currentPage: number,
    rowsPerPage: number,
    customColumnOrder?: CustomColumnOrder,
|};

export type EventWorkingListsTemplate = {|
    id: string,
    isDefault?: ?boolean,
    name: string,
    access: {
        update: boolean,
        delete: boolean,
        write: boolean,
        manage: boolean,
    },
    criteria?: Object,
    nextCriteria?: Object,
    notPreserved?: boolean,
    deleted?: boolean,
|};

export type EventWorkingListsTemplates = Array<EventWorkingListsTemplate>;
