// @flow
import type { RelationshipType } from '../metaData';
import { getTrackedEntityTypeThrowIfNotFound } from '../metaData';
import { programCollection } from '../metaDataMemoryStores';
import { getDisplayName } from '../trackedEntityInstances/getDisplayName';

const getClientConstraintByType = {
    TRACKED_ENTITY_INSTANCE: (constraint, relationshipConstraint) => {
        const tei = constraint.trackedEntityInstance;
        const trackedEntityType = getTrackedEntityTypeThrowIfNotFound(tei.trackedEntityType);
        const values = tei.attributes.reduce((accValues, attr) => {
            accValues[attr.attribute] = attr.value;
            return accValues;
        }, {});
        return {
            id: tei.trackedEntityInstance,
            name: getDisplayName(values, trackedEntityType.attributes, trackedEntityType.name),
            type: 'TRACKED_ENTITY_INSTANCE',
            linkProgramId: relationshipConstraint.programId,
        };
    },
    PROGRAM_STAGE_INSTANCE: (constraint) => {
        const event = constraint.event;
        const program = programCollection.get(event.program);
        if (!program) {
            return null;
        }

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

export function convertServerRelationshipToClient(serverRelationship: Object, relationshipTypes: Array<RelationshipType>) {
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
        from: getClientConstraintByType[relationshipType.from.entity](serverRelationship.from, relationshipType.from),
        to: getClientConstraintByType[relationshipType.to.entity](serverRelationship.to, relationshipType.to),
    };
}
