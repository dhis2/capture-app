// @flow
import { useCallback, useEffect, useState } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    getCachedSingleResourceFromKeyAsync,
} from '../../../MetaDataStoreUtils/MetaDataStoreUtils';
import { getProgramAndStageFromEvent }
    from '../../../metaData';
import { userStores } from '../../../storageControllers/stores';
import type {
    InputRelationship, RelationshipData,
} from '../../Pages/common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';
import { getDisplayFieldsFromAPI, getBaseConfigHeaders } from '../../Pages/Enrollment/EnrollmentPageDefault/hooks/constants';

const convertAttributes = (attributes, displayFields, options) => displayFields.map((item) => {
    if (item.convertValue) {
        return {
            id: item.id,
            value: item.convertValue(options),
        };
    }
    const attributeItem = Array.isArray(attributes)
        ? attributes.find(({ attribute }) => attribute === item.id)?.value : attributes[item.id];
    return {
        id: item.id,
        value: attributeItem,
    };
});

const getDisplayFields = (type) => {
    let displayFields = getDisplayFieldsFromAPI[type];
    if (!displayFields?.length) {
        displayFields = getBaseConfigHeaders[type];
    }
    return displayFields;
};

const determineLinkedEntity = (
    relationshipType: Object,
    targetId: string,
    from: RelationshipData,
    to: RelationshipData,
) => {
    const { fromToName, toFromName, toConstraint, fromConstraint } = relationshipType;

    if ((to.trackedEntity && to.trackedEntity.trackedEntity === targetId) || (to.event && to.event.event === targetId)) {
        return { side: from, constraint: fromConstraint, relationshipName: toFromName };
    }

    if ((from.trackedEntity && from.trackedEntity.trackedEntity === targetId) || (from.event && from.event.event === targetId)) {
        return { side: to, constraint: toConstraint, relationshipName: fromToName };
    }

    log.error(errorCreator('Relationship type is not handled')({ relationshipType }));
    return undefined;
};


const getAttributeConstraintsForTEI = (linkedEntity: RelationshipData) => {
    if (linkedEntity.event) {
        const { event: eventId, program: programId, programStage, orgUnitName, status } = linkedEntity.event;
        /*
         * Needs refactoring when moving to Widget Library.
         * We will need to either add the program name and program stage name to the relationshipTypes
         * or do some kind of callback to get the appropriate information.
         */
        // $FlowFixMe
        const { stage, program } = getProgramAndStageFromEvent({
            eventId,
            programId,
            programStageId: programStage,
        });

        return {
            id: eventId,
            attributes: linkedEntity.event,
            options: {
                orgUnitName,
                status,
                programName: program?.name,
                programStageName: stage?.stageForm?.name,
            },
        };
    } else if (linkedEntity.trackedEntity) {
        return {
            id: linkedEntity.trackedEntity.trackedEntity,
            attributes: linkedEntity.trackedEntity.attributes,
            options: { },
        };
    }
    log.error(errorCreator('Relationship type is not handled')({ linkedEntity }));
    return undefined;
};

const getLinkedEntityInfo = (
    relationshipType: Object,
    targetId: string,
    from: RelationshipData,
    to: RelationshipData,
) => {
    const linkedEntityData = determineLinkedEntity(relationshipType, targetId, from, to);
    if (!linkedEntityData) { return undefined; }
    const metadata = getAttributeConstraintsForTEI(linkedEntityData.side);
    if (!metadata) { return undefined; }
    const { id, attributes, options } = metadata;
    const displayFields = getDisplayFields(linkedEntityData.constraint.relationshipEntity);
    return {
        id,
        relationshipName: linkedEntityData?.relationshipName,
        attributes: convertAttributes(attributes, displayFields, options),
        displayFields,
    };
};


export const useLinkedEntityGroups = (targetId: string, relationships?: Array<InputRelationship>) => {
    const [relationshipsByType, setRelationshipByType] = useState([]);

    const computeData = useCallback(async () => {
        if (!relationships) { return; }
        const relationshipTypePromises = relationships
            .map(rel => getCachedSingleResourceFromKeyAsync(userStores.RELATIONSHIP_TYPES, rel.relationshipType));

        const relationshipTypes = await Promise
            .all(relationshipTypePromises)
            .then(results => results.map(res => res.response));

        const linkedEntityGroups = relationships.reduce((acc, rel) => {
            const { relationshipType: typeId, from, to } = rel;
            const relationshipType = relationshipTypes.find(item => item.id === typeId);
            const metadata = getLinkedEntityInfo(relationshipType, targetId, from, to);
            if (!metadata) { return acc; }
            const { relationshipName, displayFields, id, attributes } = metadata;
            const typeExist = acc.find(item => item.id === typeId);
            if (typeExist) {
                typeExist.linkedEntityData.push({ id, attributes });
            } else {
                acc.push({
                    id: typeId,
                    relationshipName,
                    linkedEntityData: [{ id, attributes }],
                    headers: displayFields,
                });
            }

            return acc;
        }, []);

        setRelationshipByType(linkedEntityGroups);
    }, [relationships, targetId]);

    useEffect(() => {
        computeData();
    }, [computeData]);

    return {
        relationships: relationshipsByType,
    };
};
