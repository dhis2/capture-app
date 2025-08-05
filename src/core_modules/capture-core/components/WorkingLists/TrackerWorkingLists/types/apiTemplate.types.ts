export type ApiDataFilterText = {
    like: string,
};

export type ApiDataFilterTextUnique = {
    eq: string,
};

export type ApiDataFilterNumeric = {
    ge?: string,
    le?: string,
};

export type ApiDataFilterBoolean = {
    in: string[],
} | boolean;

export type ApiDataFilterTrueOnly = {
    eq: string,
};

export type ApiDataFilterDateContents = {
    type: 'ABSOLUTE' | 'RELATIVE',
    startDate?: string,
    endDate?: string,
    period?: string,
    startBuffer?: number,
    endBuffer?: number,
};

export type ApiDataFilterDate = { dateFilter: ApiDataFilterDateContents };

export type ApiDataFilterOptionSet = {
    in: string[],
};

type ApiAttributeFilterCommon = {
    attribute: string,
};

type ApiDataFilterCommon = {
    dataItem: string,
};

export type ApiTrackerQueryCriteria = {
    programStatus?: string,
    programStage?: string,
    status?: string,
    eventOccurredAt?: ApiDataFilterDateContents,
    scheduledAt?: ApiDataFilterDateContents,
    occurredAt?: ApiDataFilterDateContents,
    enrolledAt?: ApiDataFilterDateContents,
    followUp?: boolean,
    order?: string,
    displayColumnOrder?: string[],
    assignedUserMode?: 'CURRENT' | 'PROVIDED' | 'NONE' | 'ANY',
    assignedUsers?: string[],
    attributeValueFilters?: any[],
    dataFilters?: any[],
};

export type ApiDataFilter = (
    | ApiDataFilterText
    | ApiDataFilterTextUnique
    | ApiDataFilterNumeric
    | ApiDataFilterBoolean
    | ApiDataFilterTrueOnly
    | ApiDataFilterDate
    | ApiDataFilterOptionSet
) &
    (ApiDataFilterCommon & ApiAttributeFilterCommon);
