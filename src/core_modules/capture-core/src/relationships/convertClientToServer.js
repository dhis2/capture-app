// @flow

const getServerConstraintByType = {
    TRACKED_ENTITY_INSTANCE: entityId => ({
        trackedEntityInstance: {
            trackedEntityInstance: entityId,
        },
    }),
    PROGRAM_STAGE_INSTANCE: entityId => ({
        event: {
            event: entityId,
        },
    }),
};

export default function convertToServerRelationship(clientRelationship: Object) {
    return {
        relationshipType: clientRelationship.relationshipType.id,
        from: getServerConstraintByType[clientRelationship.from.type](clientRelationship.from.id),
        to: getServerConstraintByType[clientRelationship.to.type](clientRelationship.to.id),
    };
}
