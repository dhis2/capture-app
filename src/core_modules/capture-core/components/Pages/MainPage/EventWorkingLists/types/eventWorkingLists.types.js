// @flow
import { dataElementTypes } from '../../../../../metaData';

export type EventsMainProperties = { [eventId: string]: Object, eventId: string };
export type EventsDataElementValues = { [eventId: string]: Object};

export type ColumnMetaForDataFetching = {
    id: string,
    type: $Values<typeof dataElementTypes>,
    apiName?: string,
    isMainProperty?: boolean,
};

export type ColumnsMetaForDataFetching = Map<string, ColumnMetaForDataFetching>;

export type CustomColumnOrder = Array<{ id: string, visible: string }>;

export type ClientConfig = {
    filters: { [id: string]: any },
    sortById: string,
    sortByDirection: string,
    currentPage: number,
    rowsPerPage: number,
    customColumnOrder?: CustomColumnOrder,
};
