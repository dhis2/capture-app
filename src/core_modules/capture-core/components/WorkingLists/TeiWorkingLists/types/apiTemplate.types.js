// @flow
export type ApiDataFilterText = {|
    like: string,
|};

export type ApiDataFilterNumeric = {|
    ge?: ?string,
    le?: ?string,
|};

export type ApiDataFilterBoolean = {|
    in: Array<string>,
|} | boolean;

export type ApiDataFilterTrueOnly = {|
    eq: string,
|};

export type ApiDataFilterDateContents = {|
    type: 'ABSOLUTE' | 'RELATIVE',
    startDate?: ?string,
    endDate?: ?string,
    period?: ?string,
    startBuffer: ?number,
    endBuffer: ?number,
|};

export type ApiDataFilterDate = { dateFilter: ApiDataFilterDateContents };

export type ApiDataFilterOptionSet = {|
    in: Array<string>,
|};

type ApiAttributeFilterCommon = {|
    attribute: string,
|};

type ApiDataFilterCommon = {|
    dataItem: string,
|};

export type ApiTrackerQueryCriteria = {|
    programStatus?: ?string,
    programStage?: ?string,
    status?: ?string,
    eventOccurredAt?: ?ApiDataFilterDateContents,
    scheduledAt?: ?ApiDataFilterDateContents,
    occurredAt?: ?ApiDataFilterDateContents,
    enrolledAt?: ?ApiDataFilterDateContents,
    followUp?: ?boolean,
    order?: ?string,
    displayColumnOrder?: ?Array<string>,
    assignedUserMode?: 'CURRENT' | 'PROVIDED' | 'NONE' | 'ANY',
    assignedUsers?: Array<string>,
    attributeValueFilters?: ?Array<any>,
    dataFilters?: ?Array<any>,
|};

export type ApiDataFilter = (
    | ApiDataFilterText
    | ApiDataFilterNumeric
    | ApiDataFilterBoolean
    | ApiDataFilterTrueOnly
    | ApiDataFilterDate
    | ApiDataFilterOptionSet
) &
    (ApiDataFilterCommon & ApiAttributeFilterCommon);
