// @flow

declare type ApiDataValue = {
    dataElement: string,
    value: string,
};

declare type ApiEnrollmentEvent = {|
    event: string,
    program: string,
    programStage: string,
    orgUnit: string,
    orgUnitName: string,
    trackedEntityInstance: string,
    enrollment: string,
    enrollmentStatus: string,
    status: string,
    eventDate: string,
    dueDate: string,
    lastUpdated: string,
    dataValues: Array<ApiDataValue>,
    notes?: Array<Object>,
    deleted?: boolean,
    pendingApiResponse?: ?boolean,
|};

type ApiAttributeValues = {
    attribute: string,
    value: string,
};

declare type ApiEnrollment = {|
    attributes: Array<ApiAttributeValues>,
    events: Array<ApiEnrollmentEvent>,
|};