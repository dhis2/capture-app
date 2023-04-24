// @flow
import type { EnrollmentData, Event }
    from '../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData/useCommonEnrollmentDomainData.types';

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
        attributes: Array<TEIAttribute>,
        orgUnit: string
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
