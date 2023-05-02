// @flow

export type TrackerDataView = {
    attributes: Array<string>,
    dataElements: Array<string>,
};

export type ElementValue = {|
    attribute?: string,
    dataElement?: string,
    displayName: string,
    valueType: string,
    value: any,
|}
type CommonConstraintTypes = {|
    trackerDataView: TrackerDataView,
    program?: { id: string, name: string },
|}

export type TrackedEntityConstraint = {
    ...CommonConstraintTypes,
    relationshipEntity: 'TRACKED_ENTITY_INSTANCE',
    trackedEntityType: { id: string, name: string },
}

export type ProgramStageInstanceConstraint = {|
    ...CommonConstraintTypes,
    relationshipEntity: 'PROGRAM_STAGE_INSTANCE',
    programStage: { id: string, name: string },
|}

export type RelationshipConstraint = TrackedEntityConstraint | ProgramStageInstanceConstraint;

export type RelationshipType = {
    id: string,
    displayName: string,
    bidirectional: boolean,
    access: Object,
    toFromName: string,
    fromToName: string,
    fromConstraint: RelationshipConstraint,
    toConstraint: RelationshipConstraint,
};

export type RelationshipTypes = Array<RelationshipType>;
