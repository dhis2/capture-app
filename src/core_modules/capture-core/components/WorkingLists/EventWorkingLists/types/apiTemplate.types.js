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

type ApiDataFilterDateAbsoluteContents = {|
    type: 'ABSOLUTE',
    startDate?: ?string,
    endDate?: ?string,
|};

type ApiDataFilterDateRelativeContents = {|
    type: 'RELATIVE',
    period?: string,
    startBuffer?: number,
    endBuffer?: number,
|};

export type ApiDataFilterDate = { dateFilter: ApiDataFilterDateAbsoluteContents | ApiDataFilterDateRelativeContents };

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
    occurredAt?: ?Object,
    status?: ?string,
    displayColumnOrder?: ?Array<string>,
    assignedUserMode?: 'CURRENT' | 'PROVIDED' | 'NONE' | 'ANY',
    assignedUsers?: Array<string>,
|};

export type CommonQueryData = {|
    programId: string,
    orgUnitId: string,
    categories: ?Object,
    programStageId?: ?string,
    ouMode?: ?string,
|};
