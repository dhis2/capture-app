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
    displayColumnOrder?: ?Array<string>,
    assignedUserMode?: 'CURRENT' | 'PROVIDED' | 'NONE' | 'ANY',
    assignedUsers?: Array<string>,
}

export type EventFilter = {
    id: string,
    name: string,
    eventQueryCriteria: EventQueryCriteria,
}

export type CommonQueryData = {
    programId: string,
    orgUnitId: string,
    categories: ?Object,
}

export type WorkingListConfig = {
    filters: Array<{id: string, requestData: any, appliedText: string, value: any}>,
    sortById: ?string,
    sortByDirection: ?string,
    columnOrder: Array<Object>,
}

export type ColumnConfig = {
    id: string,
    visible: boolean,
    isMainProperty?: ?boolean,
    apiName?: ?string,
};
