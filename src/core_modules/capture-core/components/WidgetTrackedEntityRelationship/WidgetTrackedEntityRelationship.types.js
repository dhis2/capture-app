// @flow

type Constraint = {|
    program?: { id: string },
    trackedEntityType?: { id: string },
|}

export type RelationshipType = {|
    id: string,
    displayName: string,
    bidirectional: boolean,
    fromToName: string,
    toFromName?: string,
    fromConstraint: Constraint,
    toConstraint: Constraint,
|}

export type Props = {|
    relationshipTypes: ?Array<RelationshipType>,
    renderRef: Object,
    trackedEntityType: string,
|}
