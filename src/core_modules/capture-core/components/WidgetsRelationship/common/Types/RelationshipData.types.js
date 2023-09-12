// @flow

export type ApiLinkedEntity = {|
    event?: {
        event: string,
        orgUnitName: string,
        program: string,
        orgUnit: string,
        status: string,
        dataValues: Array<{ dataElement: string, value: string }>,
    },
    trackedEntity?: {
        trackedEntity: string,
        program: string,
        orgUnit: string,
        orgUnitName: string,
        attributes: Array<{ attribute: string, value: string }>,
    },
    enrollment?: {},
|}

export type InputRelationshipData = {
    id: string,
    relationshipName: string,
    relationshipType: string,
    relationship: string,
    createdAt: string,
    bidirectional: string,
    pendingApiResponse?: boolean,
    from: ApiLinkedEntity,
    to: ApiLinkedEntity,
}
