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
|};

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

type ApiDataFilterCommon = {|
    attribute: string,
|};

export type ApiTEIQueryCriteria = {|
    programStatus?: ?string,
    occurredAt?: ?ApiDataFilterDateContents,
    enrolledAt?: ?ApiDataFilterDateContents,
    order?: ?string,
    displayColumnOrder?: ?Array<string>,
    assignedUserMode?: 'CURRENT' | 'PROVIDED' | 'NONE' | 'ANY',
    assignedUsers?: Array<string>,
    attributeValueFilters?: ?Array<any>,
|};

export type ApiDataFilter = (
    | ApiDataFilterText
    | ApiDataFilterNumeric
    | ApiDataFilterBoolean
    | ApiDataFilterTrueOnly
    | ApiDataFilterDate
    | ApiDataFilterOptionSet
) &
    ApiDataFilterCommon;
