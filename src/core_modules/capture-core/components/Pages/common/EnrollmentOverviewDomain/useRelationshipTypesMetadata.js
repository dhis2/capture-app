// @flow
import { useEffect, useState } from 'react';
import {
    getCachedSingleResourceFromKeyAsync,
} from '../../../../MetaDataStoreUtils/MetaDataStoreUtils';
import { userStores } from '../../../../storageControllers/stores';
import { getUserStorageController } from '../../../../storageControllers';
import { getApi } from '../../../../d2/d2Instance';
import type { InputRelationship } from './useCommonEnrollmentDomainData';

export const useRelationshipTypesMetadata = (relationships?: Array<InputRelationship>) => {
    const [relationshipTypesMetadata, setRelationshipTypesMetadata] = useState([]);

    const fetchDataView = async (relType) => {
        const { fromConstraint, toConstraint } = relType;

        const getPromise = (key, attributes) => {
            if (attributes.length && !attributes.some(att => att.valueType)) {
                return getApi().get(key, {
                    filter: `id:in:[${attributes.join(',')}]`,
                    fields: ['id,valueType,displayName'],
                });
            }
            return undefined;
        };

        const fetchValues = async (constraint) => {
            let requestPromise;
            if (constraint.relationshipEntity === 'TRACKED_ENTITY_INSTANCE') {
                requestPromise = getPromise('trackedEntityAttributes', constraint.trackerDataView.attributes);
            } else if (constraint.relationshipEntity === 'PROGRAM_STAGE_INSTANCE') {
                requestPromise = getPromise('dataElements', constraint.trackerDataView.dataElements);
            }
            return requestPromise;
        };

        const mergeConstraintDataValues = (constraint, dataValues) => {
            if (!dataValues) { return constraint; }
            if (constraint.relationshipEntity === 'TRACKED_ENTITY_INSTANCE') {
                if (constraint.trackerDataView.attributes.length
                    && !constraint.trackerDataView.attributes.some(att => att.valueType)) {
                    return {
                        ...constraint,
                        trackerDataView: {
                            ...constraint.trackerDataView,
                            attributes: constraint.trackerDataView.attributes
                                .map(id => dataValues.trackedEntityAttributes.find(item => item.id === id))
                                .filter(item => item),
                        } };
                }
            } else if (constraint.relationshipEntity === 'PROGRAM_STAGE_INSTANCE') {
                if (constraint.trackerDataView.dataElements.length
                    && !constraint.trackerDataView.dataElements.some(att => att.valueType)) {
                    return {
                        ...constraint,
                        trackerDataView: {
                            ...constraint.trackerDataView,
                            dataElements: constraint.trackerDataView.dataElements
                                .map(id => dataValues.dataElements.find(item => item.id === id))
                                .filter(item => item),
                        },
                    };
                }
            }
            return constraint;
        };

        const [fromDataValues, toDataValues] = await Promise
            .all([fetchValues(fromConstraint), fetchValues(toConstraint)]);

        return {
            ...relType,
            fromConstraint: mergeConstraintDataValues(fromConstraint, fromDataValues),
            toConstraint: mergeConstraintDataValues(toConstraint, toDataValues),
        };
    };

    useEffect(() => {
        if (relationships) {
            const relationshipTypePromises = relationships
                .map(rel => getCachedSingleResourceFromKeyAsync(userStores.RELATIONSHIP_TYPES, rel.relationshipType));
            Promise
                .all(relationshipTypePromises)
                .then(results => Promise.all(results.map(res => fetchDataView(res.response))))
                .then((res) => {
                    const storageController = getUserStorageController();
                    setRelationshipTypesMetadata(res);
                    storageController.setAll(userStores.RELATIONSHIP_TYPES, res);
                });
        }
    }, [relationships]);


    return relationshipTypesMetadata;
};
