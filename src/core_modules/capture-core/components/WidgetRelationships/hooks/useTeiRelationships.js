// @flow
import { useCallback, useEffect, useState } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    getCachedSingleResourceFromKeyAsync,
} from '../../../MetaDataStoreUtils/MetaDataStoreUtils';
import { getProgramAndStageFromEvent, getTrackedEntityTypeThrowIfNotFound }
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


const getAttributeConstraintsForTEI = (
    relationshipType: Object,
    targetId: string,
    from: RelationshipData,
    to: RelationshipData,
) => {
    const { fromToName, toFromName, toConstraint, fromConstraint } = relationshipType;
    // $FlowFixMe
    if (to.trackedEntity?.trackedEntity === targetId || to.event?.event === targetId) {
        if (from.event) {
            // $FlowFixMe
            const { stage, program } = getProgramAndStageFromEvent({
                evenId: from.event.event,
                programId: from.event.program,
                programStageId: from.event.programStage,
            });
            return {
                id: from.event.event,
                constraint: fromConstraint,
                attributes: from.event,
                relationshipName: toFromName,
                options: {
                    ...from.event,
                    programName: program?.name,
                    programStageName: stage?.stageForm?.name,
                },
            };
        } else if (from.trackedEntity) {
            return {
                id: from.trackedEntity.trackedEntity,
                constraint: fromConstraint,
                attributes: from.trackedEntity.attributes,
                relationshipName: toFromName,
                options: null,
            };
        }
    }
    // $FlowFixMe
    if (from.trackedEntity?.trackedEntity === targetId || from.event?.event === targetId) {
        if (to.event) {
            // $FlowFixMe
            const { stage, program } = getProgramAndStageFromEvent({
                evenId: to.event.event,
                programId: to.event.program,
                programStageId: to.event.programStage,
            });
            return {
                id: to.event.event,
                constraint: toConstraint,
                attributes: to.event,
                relationshipName: fromToName,
                options: {
                    ...to.event,
                    programName: program?.name,
                    programStageName: stage?.stageForm?.name,
                },
            };
        } else if (to.trackedEntity) {
            return {
                id: to.trackedEntity.trackedEntity,
                constraint: toConstraint,
                attributes: to.trackedEntity.attributes,
                relationshipName: fromToName,
                options: null,
            };
        }
    }

    log.error(errorCreator('Relationship type is not handled')({ relationshipType }));
    return undefined;
};

const getRelationshipAttributes = (
    relationshipType: Object,
    targetId: string,
    from: RelationshipData,
    to: RelationshipData,
    relationship: Object,
) => {
    const data = getAttributeConstraintsForTEI(relationshipType, targetId, from, to);
    if (!data) { return undefined; }
    const { id, relationshipName, constraint, attributes: constraintAttributes, options: constraintOptions } = data;
    let options = constraintOptions;
    if (!options) {
        const tet = getTrackedEntityTypeThrowIfNotFound(constraint.trackedEntityType.id);
        options = { ...relationship, trackedEntityTypeName: tet.name };
    }
    const displayFields = getDisplayFields(constraint.relationshipEntity);
    const attributes = convertAttributes(constraintAttributes, displayFields, options);
    return {
        id,
        relationshipName,
        attributes,
        displayFields,
    };
};


export const useTeiRelationships = (targetId: string, relationships?: Array<InputRelationship>) => {
    const [relationshipsByType, setRelationshipByType] = useState([]);

    const computeData = useCallback(async () => {
        if (!relationships) { return; }
        const relationshipTypePromises = relationships
            .map(rel => getCachedSingleResourceFromKeyAsync(userStores.RELATIONSHIP_TYPES, rel.relationshipType));

        const relationshipTypes = await Promise
            .all(relationshipTypePromises)
            .then(results => results.map(res => res.response));

        const relationshipGrouppedByType = relationships.reduce((acc, rel) => {
            const { relationshipType: typeId, from, to } = rel;
            const relationshipType = relationshipTypes.find(item => item.id === typeId);
            const metadata = getRelationshipAttributes(
                relationshipType, targetId, from, to, rel,
            );
            if (!metadata) { return acc; }
            const { relationshipName, displayFields, id, attributes } = metadata;
            const typeExist = acc.find(item => item.id === typeId);
            if (typeExist) {
                typeExist.relationshipAttributes.push({ id, attributes });
            } else {
                acc.push({
                    id: typeId,
                    relationshipName,
                    relationshipAttributes: [{ id, attributes }],
                    headers: displayFields,
                });
            }

            return acc;
        }, []);

        setRelationshipByType(relationshipGrouppedByType);
    }, [relationships, targetId]);

    useEffect(() => {
        computeData();
    }, [computeData]);

    return {
        relationships: relationshipsByType,
    };
};
