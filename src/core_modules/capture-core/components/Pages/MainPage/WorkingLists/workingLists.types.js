// @flow
export type WorkingListTemplate = {
    id: string,
    isDefault?: ?boolean,
    name: string,
    filters: Object,
}

export type ApiDataFilter = {
    dataItem: string,
    ge?: any,
    le?: any,
    in?: any,
    like?: any,
    eq?: any,
    period?: any,
}

export type ApiEventQueryCriteria = {
    dataFilters?: ?Array<ApiDataFilter>,
    order?: ?string,
    eventDate?: ?Object,
    status?: ?string,
    displayColumnOrder?: ?Array<string>,
    assignedUserMode?: 'CURRENT' | 'PROVIDED' | 'NONE' | 'ANY',
    assignedUsers?: Array<string>,
}

export type EventFilter = {
    id: string,
    name: string,
    eventQueryCriteria: ApiEventQueryCriteria,
}