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
        trackedEntityType: string,
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

export type RelationshipData = TEIRelationshipData | EventRelationshipData

export type InputRelationship = {|
    relationshipType: string,
    relationshipName: string,
    createdAt: string,
    relationship: string,
    bidirectional: boolean,
    from: RelationshipData,
    to: RelationshipData
|}

export type OutputRelationship = {
    id: string,
    relationshipName: string,
    linkedEntityData: Array<{ id: string, values: Array<RelationshipData>}>
}

export type RelationshipConstraintDataView = string | {id: string, displayName: string, valueType: string}

export type RelationshipConstraint = {
    relationshipEntity: string,
    trackedEntityType?: ?{ id: string },
    program?: ?{ id: string },
    programStage?: ?{ id: string },
    trackerDataView: {
        attributes: Array<RelationshipConstraintDataView>,
        dataElements: Array<RelationshipConstraintDataView>,
    }
}

export type RelationshipType = {
    id: string,
    bidirectional: boolean,
    displayName: string,
    fromConstraint: RelationshipConstraint,
    fromToName: string,
    toConstraint: RelationshipConstraint,
    toFromName: string,
}

export type Output = {|
    error?: any,
    enrollment?: EnrollmentData,
    attributeValues?: Array<AttributeValue>,
    relationships?: Array<InputRelationship>
|};
