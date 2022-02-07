// @flow
import { useCallback, useMemo, useEffect, useState } from 'react';
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
    headers: Array<{id: string, label: string}>,
    options: Object,
) => {
    const { bidirectional } = relationshipType;
    const getId = () => {
        if (bidirectional) {
            return from.event.event;
        }

        if (to.trackedEntityInstance.trackedEntityInstance !== teiId) {
            return to.trackedEntityInstance.trackedEntityInstance;
        }
        return teiId;
    };

    const getAttributes = () => {
        let returnAttributes = [];
        if (bidirectional) {
            returnAttributes = headers.map((item) => {
                if (item.convertValue) {
                    return {
                        id: item.id,
                        value: item.convertValue(options),
                    };
                }
                const attributeItem = from.event.dataValues.find(({ dataElement }) => dataElement === item.id);
                return {
                    id: item.id,
                    value: attributeItem.value,
                };
            });
        } else if (from.trackedEntityInstance) {
            const { attributes: fromAttributes, trackedEntityInstance: fromTeiId } = from.trackedEntityInstance;
            const { attributes: toAttributes } = to.trackedEntityInstance;

            if (fromTeiId !== teiId) {
                returnAttributes = fromAttributes;
            } else {
                returnAttributes = toAttributes;
            }
            returnAttributes = headers.map((item) => {
                if (item.convertValue) {
                    return {
                        id: item.id,
                        value: item.convertValue(options),
                    };
                }
                const attributeItem = returnAttributes.find(({ attribute }) => attribute === item.id);
                return {
                    id: item.id,
                    value: attributeItem.value,
                };
            });
        }

        return returnAttributes;
    };

    return {
        id: getId(),
        attributes: getAttributes(),
    };
};

const relationshipEntities = {
    TRACKED_ENTITY_INSTANCE: 'TRACKED_ENTITY_INSTANCE',
    PROGRAM_STAGE_INSTANCE: 'PROGRAM_STAGE_INSTANCE',
};

const getDisplayFields = () => [{ id: 'zDhUuAYrxNC', label: 'Last name' }, { id: 'w75KJ2mc4zz', label: 'First name' }];

const getBaseConfigHeaders = {
    [relationshipEntities.TRACKED_ENTITY_INSTANCE]: [{
        id: 'tetName',
        label: 'TET name',
        convertValue: props => props.trackedEntityType?.displayName,
    }, {
        id: 'createdDate',
        label: 'Created date',
        convertValue: props => props.created,
    }],
    [relationshipEntities.PROGRAM_STAGE_INSTANCE]: [{
        id: 'programStageName',
        label: 'Program stage name',
        convertValue: props => props.programStage?.name,
    },
    {
        id: 'createdDate',
        label: 'Created date',
        convertValue: props => props.created,
    }],
};
export const useComputeTEIRelationships = (teiId: string, relationships?: Array<TEIRelationship>) => {
    const [relationshipsByType, setRelationshipByType] = useState([]);

    const computeData = useCallback(async () => {
        const groupped = [];
        if (!relationships) { return; }
        for await (const relationship of relationships) {
            const { relationshipType: typeId, from, to, created } = relationship;

            const typeExist = groupped.find(item => item.id === typeId);
            const {
                bidirectional,
                toFromName,
                fromToName,
                fromConstraint,
            } = await getCachedSingleResourceFromKeyAsync(userStores.RELATIONSHIP_TYPES, typeId)
                .then(result => result.response);

            let displayFields = getDisplayFields();
            if (!displayFields.length) {
                displayFields = getBaseConfigHeaders[fromConstraint.relationshipEntity];
            }

            console.log({ displayFields });
            const relationshipAttributes = getRelationshipAttributes(
                bidirectional, teiId, from, to, displayFields, { created },
            );
            if (typeExist) {
                typeExist.relationshipAttributes.push(relationshipAttributes);
            } else {
                groupped.push({
                    id: typeId,
                    relationshipName: bidirectional ? toFromName : fromToName,
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
