// @flow

export type DataFilter = {
    dataItem: string,
    ge?: any,
    le?: any,
    in?: any,
    like?: any,
    eq?: any,
    period?: any,
}

export type EventQueryCriteria = {
    dataFilters?: ?Array<DataFilter>,
    order?: ?string,
    eventDate?: ?Object,
    status?: ?string,
}

export type ServerWorkingListConfig = {
    id: string,
    name: string,
    eventQueryCriteria: EventQueryCriteria,
}
