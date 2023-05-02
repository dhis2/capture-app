// @flow

export type RelationshipTableHeader = {|
    id: string,
    displayName: string,
    convertValue: (value: any) => any,
|}

export type UrlParameters = {|
    programId?: string,
    orgUnitId?: string,
    teiId?: string,
    enrollmentId?: string,
|}

export type LinkedEntityData = {
    id: string,
    values: Array<{ id: string, value: ?string }>,
    parameters: UrlParameters,
}

export type ApiLinkedEntity = {|
    event?: {
        event: string,
        orgUnitName: string,
        status: string,
        dataValues: Array<{ dataElement: string, value: string }>,
    },
    trackedEntity?: {
        trackedEntity: string,
        orgUnitName: string,
        attributes: Array<{ attribute: string, value: string }>,
    }
|}

export type InputRelationshipData = {
    id: string,
    relationshipName: string,
    relationshipType: string,
    relationship: string,
    createdAt: string,
    bidirectional: string,
    from: ApiLinkedEntity,
    to: ApiLinkedEntity,
}

export type OutputRelationshipData = {
    id: string,
    relationshipName: string,
    headers: Array<RelationshipTableHeader>,
    linkedEntityData: Array<LinkedEntityData>,
}
