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

export type TEIAttribute = {|
    attribute: string,
    displayName: string,
    value: string,
    valueType: string,
|}

export type TEIData = {|
    trackedEntityInstance: {
        trackedEntityInstance: string,
        attributes: Array<TEIAttribute>
    }
|}

export type EventData = {|
    event: Event
|}

export type RelationshipData = TEIData | EventData

export type TEIRelationship = {|
    relationshipType: string,
    relationshipName: string,
    relationship: string,
    bidirectional: boolean,
    from: RelationshipData,
    to: RelationshipData
|}

export type OutputRelationship = {
    id: string,
    relationshipName: string,
    relationshipAttributes: Array<{ id: string, attributes: Array<RelationshipData>}>
}

export type Output = {|
    error?: any,
    enrollment?: EnrollmentData,
    attributeValues?: Array<AttributeValue>,
    relationships?: {[key: string]: Array<TEIRelationship>}
|};
