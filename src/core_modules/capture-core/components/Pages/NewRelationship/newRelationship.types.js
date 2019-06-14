// @flow

export type NewRelationshipData = {
    entity: {
        id: string,
        type: string,
    },
    relationshipTypeId: string,
};

export type SelectedRelationshipType = {
    id: string,
    name: string,
    from: {
        entity: string,
        programId?: ?string,
        programStageId?: ?string,
        trackedEntityTypeId: string,
    },
    to: {
        entity: string,
        programId?: ?string,
        programStageId?: ?string,
        trackedEntityTypeId: string,
    },
}
