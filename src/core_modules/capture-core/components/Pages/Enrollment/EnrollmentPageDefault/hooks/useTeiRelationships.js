// @flow
import { useCallback, useEffect, useState } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import {
    getCachedSingleResourceFromKeyAsync,
} from '../../../../../MetaDataStoreUtils/MetaDataStoreUtils';
import { getProgramAndStageFromEvent, getTrackedEntityTypeThrowIfNotFound }
    from '../../../../../metaData';
import { userStores } from '../../../../../storageControllers/stores';
import type {
    InputRelationship, RelationshipData,
} from '../../../common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';
import { getDisplayFieldsFromAPI, getBaseConfigHeaders } from './constants';

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
    teiId: string,
    from: RelationshipData,
    to: RelationshipData,
) => {
    const { fromToName, toFromName, toConstraint, fromConstraint } = relationshipType;
    // $FlowFixMe
    if (to.trackedEntity?.trackedEntity === teiId) {
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
    if (from.trackedEntity?.trackedEntity === teiId) {
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
    teiId: string,
    from: RelationshipData,
    to: RelationshipData,
    relationship: Object,
) => {
    const data = getAttributeConstraintsForTEI(relationshipType, teiId, from, to);
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


export const useTeiRelationships = (teiId: string, relationships?: Array<InputRelationship>) => {
    const [relationshipsByType, setRelationshipByType] = useState([]);

    const computeData = useCallback(async () => {
        const groupped = [];

        if (!relationships) { return; }
        // $FlowFixMe
        for await (const relationship of relationships) {
            const { relationshipType: typeId, from, to } = relationship;
            const relationshipType = await getCachedSingleResourceFromKeyAsync(
                userStores.RELATIONSHIP_TYPES, typeId,
            ).then(result => result.response);

            const metadata = getRelationshipAttributes(
                relationshipType, teiId, from, to, relationship,
            );
            if (!metadata) { return; }
            const { relationshipName, displayFields, id, attributes } = metadata;
            const typeExist = groupped.find(item => item.id === typeId);

            if (typeExist) {
                typeExist.relationshipAttributes.push({ id, attributes });
            } else {
                groupped.push({
                    id: typeId,
                    relationshipName,
                    relationshipAttributes: [{ id, attributes }],
                    headers: displayFields,
                });
            }
        }

        setRelationshipByType(groupped);
    }, [relationships, teiId]);

    useEffect(() => {
        computeData();
    }, [computeData]);

    return {
        relationships: relationshipsByType,
    };
};
