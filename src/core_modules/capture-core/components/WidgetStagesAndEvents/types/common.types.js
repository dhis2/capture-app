// @flow

type DataValue = {
    dataElement: string,
    value: string | number
}

export type Event = {
    dataValues: Array<DataValue>,
    deleted: boolean,
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
    status: string,
    trackedEntityInstance: string
}
