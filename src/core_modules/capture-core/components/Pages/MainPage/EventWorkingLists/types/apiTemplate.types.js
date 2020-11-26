// @flow
import { typeof apiAssigneeFilterModes } from '../constants';

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

type ApiDataFilterDateAbsolute = {|
    type: 'ABSOLUTE',
    startDate?: ?string,
    endDate?: ?string,
|};

type ApiDataFilterDateRelative = {|
    type: 'RELATIVE',
    period: string,
|};

export type ApiDataFilterDate = ApiDataFilterDateAbsolute | ApiDataFilterDateRelative;

export type ApiDataFilterAssignee = {|
    assignedUserMode: $Values<apiAssigneeFilterModes>,
    assignedUsers: ?Array<string>,
|};

export type ApiDataFilterOptionSet = {|
    in: Array<string>,
|};

type ApiDataFilterCommon = {|
    dataItem: string,
|};

export type ApiDataFilter = (
    ApiDataFilterText |
    ApiDataFilterNumeric |
    ApiDataFilterBoolean |
    ApiDataFilterTrueOnly |
    ApiDataFilterDate |
    ApiDataFilterAssignee |
    ApiDataFilterOptionSet
) & ApiDataFilterCommon;

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
