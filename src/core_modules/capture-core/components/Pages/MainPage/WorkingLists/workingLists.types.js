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

export type ApiDataFilterCommon = {|
    dataItem: string,
|}

export type ApiDataFilterText = {
    like: string,
}

export type ApiDataFilterNumeric = {
    ge?: ?string,
    le?: ?string,
}

export type ApiDataFilterBoolean = {
    in: Array<string>,
}

export type ApiDataFilterTrueOnly = {
    eq: string,
}

export type ApiDataFilterDateAbsolute = {|
    startDate?: ?string,
    endDate?: ?string,
|}

export type ApiDataFilterDateRelative = {|
    period: string,
|}

export type ApiDataFilterOptionSet = {|
    in: Array<string>,
|};

export type ApiDataFilterDate = ApiDataFilterDateAbsolute | ApiDataFilterDateRelative;

export type ApiEventQueryCriteria = {
    dataFilters?: ?Array<ApiDataFilter>,
    order?: ?string,
    eventDate?: ?Object,
    status?: ?string,
    displayColumnOrder?: ?Array<string>,
    assignedUserMode?: 'CURRENT' | 'PROVIDED' | 'NONE' | 'ANY',
    assignedUsers?: Array<string>,
}

export type ListConfig = {
    filters: { [id: string]: any },
    sortById: string,
    sortByDirection: string,
    currentPage: number,
    rowsPerPage: number,
    columnOrder: Array<Object>,
}

export type EventFilter = {
    id: string,
    name: string,
    eventQueryCriteria: ApiEventQueryCriteria,
}

export type CommonQueryData = {|
    programId: string,
    orgUnitId: string,
    categories: ?Object,
|}

export type ColumnConfig = {
    id: string,
    visible: boolean,
    isMainProperty?: ?boolean,
    apiName?: ?string,
};
