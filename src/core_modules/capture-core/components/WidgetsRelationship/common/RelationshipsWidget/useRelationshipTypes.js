// @flow
import { useMemo } from 'react';
import { useApiMetadataQuery } from '../../../../utils/reactQueryHelpers';
import type { ApiRelationshipTypes, RelationshipTypes } from '../Types';
import { extractElementIdsFromRelationshipTypes, formatRelationshipTypes } from '../utils';

type Element = {|
    id: string,
    displayName: string,
    valueType: string,
    optionSet?: {|
        options: Array<{
            code: string,
            name: string,
        }>,
    |},
|};

const relationshipTypesQuery = {
    resource: 'relationshipTypes',
    params: {
        filter: 'access.data.read:eq:true',
        fields: 'id,displayName,fromToName,toFromName,access[data[read,write],read,write],fromConstraint[relationshipEntity,trackerDataView,trackedEntityType[id,name],program[id,name],programStage[id,name]],toConstraint[relationshipEntity,trackerDataView,trackedEntityType[id,name],program[id,name],programStage[id,name]]',
    },
};

export const useRelationshipTypes = (cachedRelationshipTypes?: RelationshipTypes) => {
    const { data: apiRelationshipTypes, isError, isLoading } = useApiMetadataQuery<?ApiRelationshipTypes>(
        ['relationshipTypes'],
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
                fields: 'id,displayName,valueType,optionSet[id,options[code,name]]',
                filter: `id:in:[${Object.keys(attributeIds).join(',')}]`,
                paging: false,
            },
        };

        const filteredDataElementQuery = {
            resource: 'dataElements',
            params: {
                fields: 'id,displayName,valueType,optionSet[id,options[code,name]]',
                filter: `id:in:[${Object.keys(dataElementIds).join(',')}]`,
                paging: false,
            },
        };

        return {
            attributeQuery: filteredAttributeQuery,
            dataElementQuery: filteredDataElementQuery,
        };
    }, [apiRelationshipTypes]);

    const { data: apiAttributes } = useApiMetadataQuery<Array<Element>>(
        ['attributes'],
        attributeQuery,
        {
            enabled: !cachedRelationshipTypes?.length && !!attributeQuery,
            select: ({ trackedEntityAttributes }: any) => trackedEntityAttributes,
        },
    );

    const { data: apiDataElements } = useApiMetadataQuery<Array<Element>>(
        ['dataElements'],
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
