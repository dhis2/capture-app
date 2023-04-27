// @flow
import { useCallback, useEffect, useState } from 'react';
import { useDataEngine } from '@dhis2/app-runtime';
import { makeQuerySingleResource } from 'capture-core/utils/api';
import { userStores } from '../../../../storageControllers/stores';
import { getUserStorageController } from '../../../../storageControllers';
import type { InputRelationship } from '../../../WidgetRelationships/common.types';

export const useRelationshipTypesMetadata = (relationships?: Array<InputRelationship>) => {
    const [relationshipTypesMetadata, setRelationshipTypesMetadata] = useState([]);
    const dataEngine = useDataEngine();

    const fetchDataView = useCallback(async (relType) => {
        if (!relationships?.find(({ relationshipType }) => relationshipType === relType.id)) { return relType; }
        const { fromConstraint, toConstraint } = relType;

        const querySingleResource = makeQuerySingleResource(dataEngine.query.bind(dataEngine));

        const getPromise = (resource, attributes) => {
            if (attributes.length && !attributes.every(att => att.valueType)) {
                return querySingleResource({
                    resource,
                    params: {
                        filter: `id:in:[${attributes.join(',')}]`,
                        fields: ['id,valueType,displayName'],
                    },
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
                    && !constraint.trackerDataView.attributes.every(att => att.valueType)) {
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
                    && !constraint.trackerDataView.dataElements.every(att => att.valueType)) {
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
    }, [dataEngine, relationships]);

    useEffect(() => {
        if (relationships) {
            const storageController = getUserStorageController();
            const allRelationshipTypePromises = storageController.getAll(userStores.RELATIONSHIP_TYPES);
            allRelationshipTypePromises
                .then(results => Promise.all(results.map(res => fetchDataView(res))))
                .then((res) => {
                    setRelationshipTypesMetadata(res);
                    // storageController.setAll(userStores.RELATIONSHIP_TYPES, res);
                });
        }
    }, [relationships, fetchDataView]);

    return relationshipTypesMetadata;
};
