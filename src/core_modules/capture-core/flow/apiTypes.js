// @flow

declare type ApiAssignedUser = {|
    uid: string,
    username: string,
    displayName?: string,
    firstName: string,
    surname: string,
|};

declare type ApiDataValue = {
    dataElement: string,
    value: string,
};

declare type ApiEnrollmentEvent = {|
    enrollment: string,
    event: string,
    program: string,
    programStage: string,
    orgUnit: string,
    trackedEntity: string,
    enrollment: string,
    enrollmentStatus: string,
    status: 'ACTIVE' | 'VISITED' | 'COMPLETED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED',
    occurredAt: string,
    scheduledAt: string,
    updatedAt: string,
    dataValues: Array<ApiDataValue>,
    notes?: Array<Object>,
    deleted?: boolean,
    pendingApiResponse?: ?boolean,
    assignedUser?: ApiAssignedUser,
    followUp?: boolean,
|};

type ApiAttributeValues = {
    attribute: { id: string },
    value: string,
};

declare type ApiEnrollment = {|
    attributes: Array<ApiAttributeValues>,
    events: Array<ApiEnrollmentEvent>,
|};
