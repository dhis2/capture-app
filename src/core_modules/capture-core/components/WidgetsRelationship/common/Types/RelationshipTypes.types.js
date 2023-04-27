// @flow

export type TrackerDataView = {
    attributes: Array<string>,
    dataElements: Array<string>,
};

// Should probably differentiate between the different relationshipEntities here
export type RelationshipConstraint = {
    relationshipEntity: string,
    trackedEntityType?: ?{ id: string },
    program?: ?{ id: string },
    programStage?: ?{ id: string },
    trackerDataView?: ?TrackerDataView,
};

export type RelationshipType = {
    id: string,
    displayName: string,
    access: Object,
    toFromName: string,
    fromToName: string,
    fromConstraint: RelationshipConstraint,
    toConstraint: RelationshipConstraint,
};

export type RelationshipTypes = Array<RelationshipType>;
