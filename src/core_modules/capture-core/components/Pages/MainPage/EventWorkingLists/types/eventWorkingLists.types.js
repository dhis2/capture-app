// @flow

export type EventsMainProperties = { [eventId: string]: Object};
export type EventsDataElementValues = { [eventId: string]: Object};

export type ClientConfig = {|
    filters: { [id: string]: any },
    sortById: string,
    sortByDirection: string,
    currentPage: number,
    rowsPerPage: number,
    columnOrder: Array<Object>,
|};
