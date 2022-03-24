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
    orgUnitName: string,
    program: string,
    programStage: string,
    status: 'ACTIVE' | 'VISITED' | 'COMPLETED' | 'SCHEDULE' | 'OVERDUE' | 'SKIPPED',
    trackedEntityInstance: string,
    notes?: Array<Object>,
    pendingApiResponse?: ?boolean,
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
    orgUnitName: string,
    program: string,
    status: string,
    storedBy: string,
    scheduledAt: string,
    trackedEntity: string,
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

export type TEIRelationshipData = {|
    trackedEntity: {
        trackedEntity: string,
        attributes: Array<TEIAttribute>
    }
|}

export type EventRelationshipData = {|
    event: Event
|}

export type EnrollmentRelationshipData = {|
    enrollment: EnrollmentData
|}

export type RelationshipData = TEIRelationshipData | EventRelationshipData | EnrollmentRelationshipData

export type InputRelationship = {|
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
    relationships?: Array<InputRelationship>
|};
