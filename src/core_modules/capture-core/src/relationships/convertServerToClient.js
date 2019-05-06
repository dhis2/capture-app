// @flow
import { RelationshipType, getTrackedEntityTypeThrowIfNotFound } from '../metaData';
import { programCollection } from '../metaDataMemoryStores';
import getTeiDisplayName from '../trackedEntityInstances/getDisplayName';

const getClientConstraintByType = {
    TRACKED_ENTITY_INSTANCE: (constraint) => {
        const tei = constraint.trackedEntityInstance;
        const trackedEntityType = getTrackedEntityTypeThrowIfNotFound(tei.trackedEntityType);
        const values = tei.attributes.reduce((accValues, attr) => {
            accValues[attr.attribute] = attr.value;
            return accValues;
        }, {});
        return {
            id: tei.trackedEntityInstance,
            name: getTeiDisplayName(values, trackedEntityType.attributes, trackedEntityType.name),
            type: 'TRACKED_ENTITY_INSTANCE',
        };
    },
    PROGRAM_STAGE_INSTANCE: (constraint) => {
        const event = constraint.event;
        const program = programCollection.get(event.program);
        if (!program) {
            return null;
        }

        // $FlowFixMe
        const stage = program.getStage(event.programStage);
        if (!stage) {
            return null;
        }

        return {
            id: event.event,
            name: `${stage.name} event`,
            type: 'PROGRAM_STAGE_INSTANCE',
        };
    },
};

export default function convertToClientRelationship(serverRelationship: Object, relationshipTypes: Array<RelationshipType>) {
    const relationshipType = relationshipTypes.find(r => r.id === serverRelationship.relationshipType);
    if (!relationshipType) {
        return null;
    }

    return {
        id: serverRelationship.relationship,
        clientId: serverRelationship.relationship,
        relationshipType: {
            id: relationshipType.id,
            name: relationshipType.name,
        },
        from: getClientConstraintByType[relationshipType.from.entity](serverRelationship.from),
        to: getClientConstraintByType[relationshipType.to.entity](serverRelationship.to),
    };
}
