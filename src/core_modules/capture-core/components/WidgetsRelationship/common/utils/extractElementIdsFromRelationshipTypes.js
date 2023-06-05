// @flow

import type { ApiRelationshipTypes } from '../Types';

export const extractElementIdsFromRelationshipTypes = (relationshipTypes: ApiRelationshipTypes) => {
    const attributeIds = relationshipTypes
        .flatMap((relationshipType) => {
            const { fromConstraint, toConstraint } = relationshipType;
            const fromAttributes = fromConstraint.trackerDataView?.attributes || [];
            const toAttributes = toConstraint.trackerDataView?.attributes || [];
            return [...fromAttributes, ...toAttributes];
        }).reduce((acc, attributeId) => {
            acc[attributeId] = true;
            return acc;
        }, {});

    const dataElementIds = relationshipTypes
        .flatMap((relationshipType) => {
            const { fromConstraint, toConstraint } = relationshipType;
            const fromDataElements = fromConstraint.trackerDataView?.dataElements || [];
            const toDataElements = toConstraint.trackerDataView?.dataElements || [];
            return [...fromDataElements, ...toDataElements];
        }).reduce((acc, dataElementId) => {
            acc[dataElementId] = true;
            return acc;
        }, {});

    return {
        attributeIds,
        dataElementIds,
    };
};
