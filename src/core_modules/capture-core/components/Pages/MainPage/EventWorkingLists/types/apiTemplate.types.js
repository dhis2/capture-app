// @flow
import { apiAssigneeFilterModes } from '../constants';

export type ApiDataFilter = {
    dataItem: string,
    ge?: any,
    le?: any,
    in?: any,
    like?: any,
    eq?: any,
    period?: any,
};

export type ApiDataFilterCommon = {|
    dataItem: string,
|};

export type ApiDataFilterText = {
    like: string,
};

export type ApiDataFilterNumeric = {
    ge?: ?string,
    le?: ?string,
};

export type ApiDataFilterBoolean = {
    in: Array<string>,
};

export type ApiDataFilterTrueOnly = {
    eq: string,
};

export type ApiDataFilterDateAbsolute = {|
    type: 'ABSOLUTE',
    startDate?: ?string,
    endDate?: ?string,
|};

export type ApiDataFilterDateRelative = {|
    type: 'RELATIVE',
    period: string,
|};

export type ApiDataFilterDate = ApiDataFilterDateAbsolute | ApiDataFilterDateRelative;

export type ApiDataFilterAssignee = {|
    assignedUserMode: $Values<typeof apiAssigneeFilterModes>,
    assignedUsers: ?Array<string>,
|};

export type ApiDataFilterOptionSet = {|
    in: Array<string>,
|};

export type ApiEventQueryCriteria = {|
    dataFilters?: ?Array<ApiDataFilter>,
    order?: ?string,
    eventDate?: ?Object,
    status?: ?string,
    displayColumnOrder?: ?Array<string>,
    assignedUserMode?: 'CURRENT' | 'PROVIDED' | 'NONE' | 'ANY',
    assignedUsers?: Array<string>,
|};

export type CommonQueryData = {|
    programId: string,
    orgUnitId: string,
    categories: ?Object,
|};
