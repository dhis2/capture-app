// @flow
export type DataValue = {
    dataElement: string,
    value: string,
}

export type Event = {|
    dataValues: Array<DataValue>,
    deleted?: boolean,
    scheduledAt: string,
    enrollment: string,
    enrollmentStatus: string,
    event: string,
    occurredAt: string,
    updatedAt: string,
    orgUnit: string,
    program: string,
    programStage: string,
    status: 'ACTIVE' | 'VISITED' | 'COMPLETED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED',
    trackedEntity: string,
    notes?: Array<Object>,
    pendingApiResponse?: ?boolean,
    assignedUser?: ApiAssignedUser,
    followUp?: boolean,
|};

export type EnrollmentData = {|
    createdAt: string,
    createdAtClient: string,
    deleted: boolean,
    enrollment: string,
    enrolledAt: string,
    events: Array<Event>,
    occurredAt: string,
    updatedAt: string,
    updatedAtClient: string,
    orgUnit: string,
    program: string,
    status: string,
    storedBy: string,
    scheduledAt: string,
    trackedEntity: string,
    trackedEntityType: string,
    geometry?: ?{ type: string, coordinates: [number, number] | Array<[number, number]>}
|};

export type AttributeValue = {|
    id: string,
    value: string,
|};


export type Output = {|
    error?: any,
    enrollment?: EnrollmentData,
    attributeValues?: Array<AttributeValue>,
|};
