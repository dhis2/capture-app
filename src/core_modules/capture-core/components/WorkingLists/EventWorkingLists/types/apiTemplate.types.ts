import { apiAssigneeFilterModes } from '../constants';

export type ApiDataFilterText = {
    like: string,
};

export type ApiDataFilterNumeric = {
    ge?: string | null,
    le?: string | null,
};

export type ApiDataFilterBoolean = {
    in: Array<string>,
};

export type ApiDataFilterTrueOnly = {
    eq: string,
};

type ApiDataFilterDateAbsoluteContents = {
    type: 'ABSOLUTE',
    startDate?: string | null,
    endDate?: string | null,
};

type ApiDataFilterDateRelativeContents = {
    type: 'RELATIVE',
    period?: string,
    startBuffer?: number,
    endBuffer?: number,
};

export type ApiDataFilterDate = { dateFilter: ApiDataFilterDateAbsoluteContents | ApiDataFilterDateRelativeContents };

export type ApiDataFilterAssignee = {
    assignedUserMode: typeof apiAssigneeFilterModes[keyof typeof apiAssigneeFilterModes],
    assignedUsers?: Array<string> | null,
};

export type ApiDataFilterOptionSet = {
    in: Array<string>,
};

type ApiDataFilterCommon = {
    dataItem: string,
};

export type ApiDataFilter = (
    ApiDataFilterText |
    ApiDataFilterNumeric |
    ApiDataFilterBoolean |
    ApiDataFilterTrueOnly |
    ApiDataFilterDate |
    ApiDataFilterAssignee |
    ApiDataFilterOptionSet
) & ApiDataFilterCommon;

export type ApiEventQueryCriteria = {
    dataFilters?: Array<ApiDataFilter> | null,
    order?: string | null,
    occurredAt?: any | null,
    status?: string | null,
    displayColumnOrder?: Array<string> | null,
    assignedUserMode?: 'CURRENT' | 'PROVIDED' | 'NONE' | 'ANY',
    assignedUsers?: Array<string>,
};

export type CommonQueryData = {
    programId: string,
    orgUnitId: string,
    categories: any | null,
    programStageId?: string | null,
    ouMode?: string | null,
    orgUnitMode?: string | null,
};
