// @flow
import { useMemo } from 'react';
import { useMetadataApiQuery } from '../../../../utils/reactQueryHelpers';
import type { RelationshipTypes } from '../Types';
import { extractElementIdsFromRelationshipTypes, formatRelationshipTypes } from '../utils';

type Element = {|
    id: string,
    displayName: string,
    valueType: string,
|};

const relationshipTypesQuery = {
    resource: 'relationshipTypes',
    params: {
        fields: 'id,displayName,fromToName,toFromName,fromConstraint[relationshipEntity,trackerDataView,trackedEntityType[id,name],program[id,name],programStage[id,name]],toConstraint[relationshipEntity,trackerDataView,trackedEntityType[id,name],program[id,name],programStage[id,name]]',
    },
};

export const useRelationshipTypes = (cachedRelationshipTypes?: RelationshipTypes) => {
    const { data: apiRelationshipTypes, isError, isLoading } = useMetadataApiQuery<?RelationshipTypes>(
        ['widgetRelationship', 'relationshipTypes'],
        relationshipTypesQuery,
        {
            enabled: !cachedRelationshipTypes?.length,
            select: ({ relationshipTypes }: any) => relationshipTypes,
        },
    );

    const { attributeQuery, dataElementQuery } = useMemo(() => {
        if (!apiRelationshipTypes) return {};
        const { dataElementIds, attributeIds } = extractElementIdsFromRelationshipTypes(apiRelationshipTypes);

        const filteredAttributeQuery = {
            resource: 'trackedEntityAttributes',
            params: {
                fields: 'id,displayName,valueType',
                filter: `id:in:[${Object.keys(attributeIds).join(',')}]`,
                paging: false,
            },
        };

        const filteredDataElementQuery = {
            resource: 'dataElements',
            params: {
                fields: 'id,displayName,valueType',
                filter: `id:in:[${Object.keys(dataElementIds).join(',')}]`,
                paging: false,
            },
        };

        return {
            attributeQuery: filteredAttributeQuery,
            dataElementQuery: filteredDataElementQuery,
        };
    }, [apiRelationshipTypes]);

    const { data: apiAttributes } = useMetadataApiQuery<Array<Element>>(
        ['widgetRelationship', 'attributes'],
        attributeQuery,
        {
            enabled: !cachedRelationshipTypes?.length && !!attributeQuery,
            select: ({ trackedEntityAttributes }: any) => trackedEntityAttributes,
        },
    );

    const { data: apiDataElements } = useMetadataApiQuery<Array<Element>>(
        ['widgetRelationship', 'dataElements'],
        dataElementQuery,
        {
            enabled: !cachedRelationshipTypes?.length && !!dataElementQuery,
            select: ({ dataElements }: any) => dataElements,
        },
    );


    const relationshipTypes = useMemo(() => {
        if (!apiRelationshipTypes || !apiAttributes || !apiDataElements) return null;

        return formatRelationshipTypes({
            relationshipTypes: apiRelationshipTypes,
            attributes: apiAttributes,
            dataElements: apiDataElements,
        });
    }, [apiAttributes, apiDataElements, apiRelationshipTypes]);

    return {
        data: relationshipTypes ?? cachedRelationshipTypes,
        isError,
        isLoading,
    };
};
