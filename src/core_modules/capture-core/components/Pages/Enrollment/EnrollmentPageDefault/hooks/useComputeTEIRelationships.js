// @flow
import { useCallback, useEffect, useState } from 'react';
import {
    getCachedSingleResourceFromKeyAsync,
} from '../../../../../MetaDataStoreUtils/MetaDataStoreUtils';
import { getProgramAndStageFromEvent, getTrackedEntityTypeThrowIfNotFound }
    from '../../../../../metaData';
import { userStores } from '../../../../../storageControllers/stores';
import type {
    TEIRelationship, RelationshipData,
} from '../../../common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';
import { getDisplayFieldsFromAPI, getBaseConfigHeaders } from './constants';

const getRelationshipAttributes = (
    relationshipType: Object,
    teiId: string,
    from: RelationshipData,
    to: RelationshipData,
    relationship: Object,
) => {
    const { bidirectional, fromToName, toFromName, toConstraint, fromConstraint } = relationshipType;

    const getAttributes = (attributes, displayFields, options) => displayFields.map((item) => {
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
        if (!displayFields.length) {
            displayFields = getBaseConfigHeaders[type];
        }
        return displayFields;
    };

    if (to?.trackedEntityInstance && to?.trackedEntityInstance?.trackedEntityInstance !== teiId) {
        const displayFields = getDisplayFields(toConstraint.relationshipEntity);
        const tet = getTrackedEntityTypeThrowIfNotFound(toConstraint.trackedEntityType.id);
        const attributes = getAttributes(to.trackedEntityInstance.attributes, displayFields,
            { ...relationship, trackedEntityTypeName: tet.name });

        return {
            id: to.trackedEntityInstance.trackedEntityInstance,
            relationshipName: fromToName,
            relationshipProgram: toConstraint.program,
            attributes,
            displayFields,
        };
    } else if (bidirectional && from?.trackedEntityInstance &&
        from?.trackedEntityInstance?.trackedEntityInstance !== teiId) {
        const displayFields = getDisplayFields(fromConstraint.relationshipEntity);
        const tet = getTrackedEntityTypeThrowIfNotFound(toConstraint.trackedEntityType.id);
        const attributes = getAttributes(from.trackedEntityInstance.attributes, displayFields,
            { ...relationship, trackedEntityTypeName: tet.name });

        return {
            id: from.trackedEntityInstance.trackedEntityInstance,
            relationshipName: toFromName,
            relationshipProgram: fromConstraint.program,
            attributes,
            displayFields,
        };
    } else if (bidirectional && from?.event) {
        const displayFields = getDisplayFields(fromConstraint.relationshipEntity);
        // $FlowFixMe
        const { stage, program } = getProgramAndStageFromEvent({
            evenId: from.event.event,
            programId: from.event.program,
            programStageId: from.event.programStage,
        });
        const attributes = getAttributes(from.event, displayFields, {
            ...from.event,
            programName: program?.name,
            programStageName: stage?.stageForm?.name,
        });

        return {
            id: from.event.event,
            relationshipName: toFromName,
            relationshipProgram: fromConstraint.program,
            attributes,
            displayFields,
        };
    }

    return {};
};


export const useComputeTEIRelationships = (teiId: string, relationships?: Array<TEIRelationship>) => {
    const [relationshipsByType, setRelationshipByType] = useState([]);

    const computeData = useCallback(async () => {
        const groupped = [];
        if (!relationships) { return; }
        // $FlowFixMe
        for await (const relationship of relationships) {
            const { relationshipType: typeId, from, to } = relationship;

            const typeExist = groupped.find(item => item.id === typeId);
            const relationshipType = await getCachedSingleResourceFromKeyAsync(userStores.RELATIONSHIP_TYPES, typeId)
                .then(result => result.response);

            const { relationshipName, displayFields, id, attributes } = getRelationshipAttributes(
                relationshipType, teiId, from, to, { relationship },
            );
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

    return { relationshipsByType };
};
