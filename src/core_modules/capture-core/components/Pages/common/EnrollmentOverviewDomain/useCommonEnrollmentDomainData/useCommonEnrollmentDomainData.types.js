// @flow

export type DataValue = {
    dataElement: string,
    value: string,
}

export type Event = {|
    dataValues: Array<DataValue>,
    deleted?: boolean,
    dueDate: string,
    enrollment: string,
    enrollmentStatus: string,
    event: string,
    eventDate: string,
    lastUpdated: string,
    orgUnit: string,
    orgUnitName: string,
    program: string,
    programStage: string,
    status: 'ACTIVE' | 'VISITED' | 'COMPLETED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED',
    trackedEntityInstance: string,
    notes?: Array<Object>,
    pendingApiResponse?: ?boolean,
|};

export type EnrollmentData = {|
    created: string,
    createdAtClient: string,
    deleted: boolean,
    enrollment: string,
    enrollmentDate: string,
    events: Array<Event>,
    incidentDate: ?string,
    lastUpdated: string,
    lastUpdatedAtClient: string,
    orgUnit: string,
    orgUnitName: string,
    program: string,
    status: string,
    storedBy: string,
    trackedEntityInstance: string,
    trackedEntityType: string,
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
