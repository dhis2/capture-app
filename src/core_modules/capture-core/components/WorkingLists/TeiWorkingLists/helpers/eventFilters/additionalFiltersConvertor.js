// @flow
export const ADDITIONAL_FILTERS = {
    programStage: 'programStage',
    occurredAt: 'eventOccurredAt',
    scheduledAt: 'scheduledAt',
    status: 'status',
    assignedUser: 'assignee',
    orgUnit: 'eventOrgUnit',
};

export const ADDITIONAL_FILTERS_LABELS = {
    programStage: 'Program stage',
    occurredAt: 'Report date',
    scheduledAt: 'Scheduled date',
    status: 'Event status',
    assignee: 'Assigned to',
    orgUnit: 'Event organisation unit',
};

export const ADDITIONAL_FILTERS_API_NAME = {
    [ADDITIONAL_FILTERS.occurredAt]: 'occurredAt',
    [ADDITIONAL_FILTERS.assignedUser]: 'assignedUser',
};

export const getFilterApiName = (clientFilter: string) => ADDITIONAL_FILTERS_API_NAME[clientFilter] || clientFilter;
export const getFilterClientName = (apiFilter: string) => ADDITIONAL_FILTERS[apiFilter] || apiFilter;
