// @flow
import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import {
    getCachedSingleResourceFromKeyAsync,
} from '../../../../../MetaDataStoreUtils/MetaDataStoreUtils';
import { userStores } from '../../../../../storageControllers/stores';
import type {
    TEIRelationship, RelationshipData,
} from '../../../common/EnrollmentOverviewDomain/useCommonEnrollmentDomainData';

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
        const attributes = getAttributes(to.trackedEntityInstance.attributes, displayFields, { ...relationship });

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
        const attributes = getAttributes(from.trackedEntityInstance.attributes, displayFields, { ...relationship });

        return {
            id: from.trackedEntityInstance.trackedEntityInstance,
            relationshipName: toFromName,
            relationshipProgram: fromConstraint.program,
            attributes,
            displayFields,
        };
    } else if (bidirectional && from?.event?.event) {
        const displayFields = getDisplayFields(fromConstraint.relationshipEntity);
        const attributes = getAttributes(from.event, displayFields, { ...from.event });

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

const relationshipEntities = {
    TRACKED_ENTITY_INSTANCE: 'TRACKED_ENTITY_INSTANCE',
    PROGRAM_STAGE_INSTANCE: 'PROGRAM_STAGE_INSTANCE',
};

const getDisplayFieldsFromAPI = {
    [relationshipEntities.TRACKED_ENTITY_INSTANCE]: [
        { id: 'w75KJ2mc4zz', label: 'First name' },
        { id: 'zDhUuAYrxNC', label: 'Last name' },
    ],
    [relationshipEntities.PROGRAM_STAGE_INSTANCE]: [
        { id: 'orgUnitName', label: 'Organisation unit' },
        { id: 'program', label: 'Program' },
        { id: 'eventDate',
            label: 'Event date',
            convertValue: props => moment(props.eventDate).format('YYYY-MM-DD'),
        },
        { id: 'status', label: 'Status' },
    ],
};

const getBaseConfigHeaders = {
    [relationshipEntities.TRACKED_ENTITY_INSTANCE]: [{
        id: 'tetName',
        label: 'TET name',
        convertValue: props => props.trackedEntityType?.displayName,
    }, {
        id: 'createdDate',
        label: 'Created date',
        convertValue: props => moment(props.created).format('YYYY-MM-DD'),
    }],
    [relationshipEntities.PROGRAM_STAGE_INSTANCE]: [{
        id: 'programStageName',
        label: 'Program stage name',
        convertValue: props => props.programStage?.name,
    },
    {
        id: 'createdDate',
        label: 'Created date',
        convertValue: props => moment(props.created).format('YYYY-MM-DD'),
    }],
};

export const useComputeTEIRelationships = (teiId: string, relationships?: Array<TEIRelationship>) => {
    const [relationshipsByType, setRelationshipByType] = useState([]);

    const computeData = useCallback(async () => {
        const groupped = [];
        if (!relationships) { return; }
        for await (const relationship of relationships) {
            const { relationshipType: typeId, from, to } = relationship;

            const typeExist = groupped.find(item => item.id === typeId);
            const relationshipType = await getCachedSingleResourceFromKeyAsync(userStores.RELATIONSHIP_TYPES, typeId)
                .then(result => result.response);

            const { relationshipName, displayFields, ...relationshipAttributes } = getRelationshipAttributes(
                relationshipType, teiId, from, to, { relationship },
            );
            if (typeExist) {
                typeExist.relationshipAttributes.push(relationshipAttributes);
            } else {
                groupped.push({
                    id: typeId,
                    relationshipName,
                    relationshipAttributes: [relationshipAttributes],
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
