const getServerConstraintByType = {
    TRACKED_ENTITY_INSTANCE: (entityId: string) => ({
        trackedEntity: { trackedEntity: entityId },
    }),
    PROGRAM_STAGE_INSTANCE: (entityId: string) => ({
        event: { event: entityId },
    }),
};

export function convertClientRelationshipToServer(clientRelationship: any) {
    return {
        relationshipType: clientRelationship.relationshipType.id,
        from: getServerConstraintByType[clientRelationship.from.type](clientRelationship.from.id),
        to: getServerConstraintByType[clientRelationship.to.type](clientRelationship.to.id),
    };
}
