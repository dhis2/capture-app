export type NewRelationshipData = {
    entity: {
        id: string;
        type: string;
    };
    relationshipTypeId: string;
};

export type SelectedRelationshipType = {
    id: string;
    name: string;
    from: {
        entity: string;
        programId?: string | null;
        programStageId?: string | null;
        trackedEntityTypeId: string | null;
    };
    to: {
        entity: string;
        programId?: string | null;
        programStageId?: string | null;
        trackedEntityTypeId: string | null;
    };
};
