// @flow
import { useCallback, useEffect, useState } from 'react';
import log from 'loglevel';
import moment from 'moment';
import { errorCreator } from 'capture-core-utils';
import { getBaseConfigHeaders, relationshipEntities } from '../../constants';
import { convertServerToClient, convertClientToList } from '../../../../converters';
import type {
    ApiLinkedEntity,
    ElementValue,
    InputRelationshipData, ProgramStageInstanceConstraint,
    RelationshipConstraint,
    RelationshipType,
    RelationshipTypes, TrackedEntityConstraint,
} from '../Types';

const convertAttributes = (
    attributes: Array<ElementValue>,
    displayFields: Array<Object>,
    options: Object,
): Array<{id: string, value: any}> => displayFields.map((field) => {
    if (field.convertValue) {
        return {
            id: field.id,
            value: field.convertValue(options),
        };
    }

    const attributeItem = attributes.find((att) => {
        if (att.attribute) { return att.attribute === field.id; }
        if (att.dataElement) { return att.dataElement === field.id; }
        return undefined;
    })?.value;

    return {
        id: field.id,
        value: convertClientToList(convertServerToClient(attributeItem, field.valueType), field.valueType),
    };
});

const getDisplayFields = (linkedEntity) => {
    let displayFields;
    if (linkedEntity.relationshipEntity === relationshipEntities.TRACKED_ENTITY_INSTANCE) {
        displayFields = linkedEntity.trackerDataView.attributes;
    } else if (linkedEntity.relationshipEntity === relationshipEntities.PROGRAM_STAGE_INSTANCE) {
        displayFields = linkedEntity.trackerDataView.dataElements;
    }
    if (!displayFields?.length) {
        displayFields = getBaseConfigHeaders[linkedEntity.relationshipEntity];
    }

    return displayFields;
};

const determineLinkedEntity = (
    relationshipType: RelationshipType,
    targetId: string,
    fromEntity: ApiLinkedEntity,
    toEntity: ApiLinkedEntity,
) => {
    const { id, toConstraint, fromConstraint, toFromName, fromToName } = relationshipType;

    if ((toEntity.trackedEntity && toEntity.trackedEntity.trackedEntity === targetId) || (toEntity.event && toEntity.event.event === targetId)) {
        return { side: fromEntity, constraint: fromConstraint, groupId: `${id}-from`, name: toFromName };
    }

    if ((fromEntity.trackedEntity && fromEntity.trackedEntity.trackedEntity === targetId) || (fromEntity.event && fromEntity.event.event === targetId)) {
        return { side: toEntity, constraint: toConstraint, groupId: `${id}-to`, name: fromToName };
    }

    log.error(errorCreator('Relationship type is not handled')({ relationshipType }));
    return undefined;
};


const getLinkedRecordURLParameters = (linkedEntity: Object, entityConstraint: RelationshipConstraint) => {
    if (linkedEntity.event) {
        const {
            event: eventId,
            program: programId,
            orgUnit: orgUnitId,
        } = linkedEntity.event;
        return { eventId, programId, orgUnitId };
    } else if (linkedEntity.trackedEntity) {
        const programId = entityConstraint.program?.id;
        const { trackedEntity: teiId, orgUnit: orgUnitId } = linkedEntity.trackedEntity;
        return { programId, orgUnitId, teiId };
    }
    return {};
};

const getAttributeConstraintsForTEI = (
    linkedEntity: ApiLinkedEntity,
    entityConstraint: RelationshipConstraint,
    createdAt: string) => {
    if (linkedEntity.event) {
        const { event: eventId, orgUnitName, status } = linkedEntity.event;
        const { program, programStage }: ProgramStageInstanceConstraint = (entityConstraint: any);

        return {
            id: eventId,
            values: linkedEntity.event.dataValues,
            parameters: getLinkedRecordURLParameters(linkedEntity, entityConstraint),
            options: {
                orgUnitName,
                status,
                programName: program?.name,
                programStageName: programStage?.name,
                created: createdAt,
            },
        };
    } else if (linkedEntity.trackedEntity) {
        const { trackedEntity, attributes } = linkedEntity.trackedEntity;
        const { trackedEntityType }: TrackedEntityConstraint = (entityConstraint: any);

        return {
            id: trackedEntity,
            values: attributes,
            parameters: getLinkedRecordURLParameters(linkedEntity, entityConstraint),
            options: {
                trackedEntityTypeName: trackedEntityType?.name ?? '',
                created: createdAt,
            },
        };
    }
    log.error(errorCreator('Relationship type is not handled')({ linkedEntity }));
    return undefined;
};

const getLinkedEntityInfo = (
    relationshipType: RelationshipType,
    targetId: string,
    fromEntity: ApiLinkedEntity,
    toEntity: ApiLinkedEntity,
    createdAt: string,
) => {
    const linkedEntityData = determineLinkedEntity(relationshipType, targetId, fromEntity, toEntity);
    if (!linkedEntityData) { return undefined; }

    const metadata = getAttributeConstraintsForTEI(linkedEntityData.side, linkedEntityData.constraint, createdAt);
    if (!metadata) { return undefined; }

    const { id, values, options, parameters } = metadata;
    const displayFields = getDisplayFields(linkedEntityData.constraint);

    return {
        id,
        displayFields,
        parameters,
        groupId: linkedEntityData.groupId,
        // $FlowFixMe - value should have either attribute or dataElement
        values: convertAttributes(values, displayFields, options),
        name: linkedEntityData.name,
    };
};


export const useLinkedEntityGroups = (
    targetId: string,
    relationshipTypes: ?RelationshipTypes,
    relationships?: Array<InputRelationshipData>,
) => {
    const [relationshipsByType, setRelationshipByType] = useState([]);

    const computeData = useCallback(() => {
        if (relationships?.length && relationshipTypes?.length) {
            const linkedEntityGroups = relationships
                .sort((a, b) => moment.utc(b.createdAt).diff(moment.utc(a.createdAt)))
                .reduce((acc, relationship) => {
                    const { relationshipType: typeId, from: fromEntity, to: toEntity, createdAt } = relationship;
                    const relationshipType = relationshipTypes.find(item => item.id === typeId);

                    if (!relationshipType) { return acc; }
                    const metadata = getLinkedEntityInfo(relationshipType, targetId, fromEntity, toEntity, createdAt);
                    if (!metadata) { return acc; }
                    const { displayFields, id, values, parameters, groupId, name } = metadata;

                    const typeExist = acc.find(item => item.id === groupId);
                    if (typeExist) {
                        typeExist.linkedEntityData.push({ id, values, parameters });
                    } else {
                        acc.push({
                            id: groupId,
                            relationshipName: name || relationshipType.displayName,
                            linkedEntityData: [{ id, values, parameters }],
                            headers: displayFields,
                        });
                    }

                    return acc;
                }, []);

            setRelationshipByType(linkedEntityGroups);
        }
    }, [relationships, relationshipTypes, targetId]);

    useEffect(() => {
        computeData();
    }, [computeData]);

    return {
        relationships: relationshipsByType,
    };
};
