// @flow
import { useEffect, useState } from 'react';
import {
    getCachedSingleResourceFromKeyAsync,
} from '../../../../MetaDataStoreUtils/MetaDataStoreUtils';
import { userStores } from '../../../../storageControllers/stores';
import { getApi } from '../../../../d2/d2Instance';
import type { InputRelationship } from './useCommonEnrollmentDomainData';

export const useRelationshipTypesMetadata = (relationships?: Array<InputRelationship>) => {
    const [relationshipTypesMetadata, setRelationshipTypesMetadata] = useState([]);

    const fetchDataView = async (relType) => {
        const { fromConstraint, toConstraint } = relType;

        const fetchValues = async (constraint) => {
            let requestPromise;
            if (constraint.relationshipEntity === 'TRACKED_ENTITY_INSTANCE') {
                if (!constraint.trackerDataView.attributes.every(att => att.valueType)) {
                    requestPromise = getApi().get('trackedEntityAttributes', {
                        filter: `id:in:[${constraint.trackerDataView.attributes.join(',')}]`,
                        fields: ['id,valueType,displayName'],

                    });
                }
            } else if (constraint.relationshipEntity === 'PROGRAM_STAGE_INSTANCE') {
                if (!constraint.trackerDataView.dataElements.every(att => att.valueType)) {
                    requestPromise = getApi().get('dataElements', {
                        filter: `id:in:[${constraint.trackerDataView.dataElements.join(',')}]`,
                        fields: ['id,valueType,displayName'],
                    });
                }
            }
            return requestPromise;
        };

        const mergeConstraintDataValues = (constraint, dataValues) => {
            if (!dataValues) { return constraint; }
            if (constraint.relationshipEntity === 'TRACKED_ENTITY_INSTANCE') {
                if (!constraint.trackerDataView.attributes.every(att => att.valueType)) {
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
                if (!constraint.trackerDataView.dataElements.every(att => att.valueType)) {
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
                    setRelationshipTypesMetadata(res);
                });
        }
    }, [relationships]);


    return relationshipTypesMetadata;
};
