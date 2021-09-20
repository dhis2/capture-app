// @flow
import type { OrgUnit } from 'capture-core-utils/rulesEngine';
import type { Program } from 'capture-core/metaData';
import { dataElementTypes } from 'capture-core/metaData';


type DataValue = {
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
    status: string,
    trackedEntityInstance: string,
    notes?: Array<Object>,
|};

export type EnrollmentData = {
    created: string,
    createdAtClient: string,
    deleted: boolean,
    enrollment: string,
    enrollmentDate: string,
    events: Array<Event>,
    incidentDate: string,
    lastUpdated: string,
    lastUpdatedAtClient: string,
    orgUnit: string,
    orgUnitName: string,
    program: string,
    status: string,
    storedBy: string,
    trackedEntityInstance: string,
    trackedEntityType: string,
}

type InputDataElement = {
    id: string,
    valueType: $Keys<typeof dataElementTypes>,
    optionSet?: ?{
        id: string
    }
}
type InputProgramMetadata = {
    programStages: Array<{
        id: string,
        programStageDataElements: Array<{ dataElement: InputDataElement}>
    }>
}

type InputTrackedEntityAttributes = {
    value: string,
    valueType: $Keys<typeof dataElementTypes>,
    attribute: string,
    optionSet?: {
        id: string
    }
}

export type InputRuleEnrollmentData = {
    orgUnit: OrgUnit,
    program: Program,
    programMetadata: InputProgramMetadata,
    enrollment: EnrollmentData,
    attributes: Array<InputTrackedEntityAttributes>,
}
