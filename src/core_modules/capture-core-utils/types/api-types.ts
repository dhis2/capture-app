export type ApiAssignedUser = {
    uid: string;
    username: string;
    displayName?: string;
    firstName: string;
    surname: string;
};

export type ApiDataValue = {
    dataElement: string;
    value: string;
};

export type ApiEnrollmentEvent = {
    enrollment: string;
    event: string;
    program: string;
    programStage: string;
    orgUnit: string;
    trackedEntity: string;
    enrollmentStatus: string;
    status: 'ACTIVE' | 'VISITED' | 'COMPLETED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED';
    occurredAt: string;
    scheduledAt: string;
    updatedAt: string;
    dataValues: Array<ApiDataValue>;
    notes?: Array<any>;
    deleted?: boolean;
    pendingApiResponse?: boolean | null;
    assignedUser?: ApiAssignedUser;
    followUp?: boolean;
};

type ApiAttributeValues = {
    attribute: { id: string };
    value: string;
};

export type ApiEnrollment = {
    attributes: Array<ApiAttributeValues>;
    events: Array<ApiEnrollmentEvent>;
};
