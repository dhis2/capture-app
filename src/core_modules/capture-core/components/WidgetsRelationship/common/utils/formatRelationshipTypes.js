// @flow
import type { ApiRelationshipTypes, RelationshipTypes } from '../Types';
import { replaceElementIdsWithElement } from './replaceElementIdsWithElement';

const elementTypes = {
    ATTRIBUTE: 'ATTRIBUTE',
    DATA_ELEMENT: 'DATA_ELEMENT',
};

type Element = {|
    id: string,
    valueType: string,
    displayName: string,
    optionSet?: {|
        options: Array<{
            code: string,
            name: string,
        }>,
    |},
|}

type Props = {|
    relationshipTypes: ApiRelationshipTypes,
    attributes: Array<Element>,
    dataElements: Array<Element>,
|}

export const formatRelationshipTypes = ({
    relationshipTypes = [],
    attributes,
    dataElements,
}: Props): RelationshipTypes => {
    const attributesById = attributes.reduce((acc, { id, valueType, displayName, optionSet }) => {
        acc[id] = {
            valueType,
            displayName,
            options: optionSet?.options,
        };
        return acc;
    }, {});

    const dataElementsById = dataElements.reduce((acc, { id, valueType, displayName, optionSet }) => {
        acc[id] = {
            valueType,
            displayName,
            options: optionSet?.options,
        };
        return acc;
    }, {});

    return relationshipTypes
        .map((relationshipType) => {
            const { fromConstraint, toConstraint } = relationshipType;
            const fromAttributes = replaceElementIdsWithElement(
                fromConstraint.trackerDataView?.attributes,
                attributesById,
                { relationshipType, elementType: elementTypes.ATTRIBUTE },
            );
            const toAttributes = replaceElementIdsWithElement(
                toConstraint.trackerDataView?.attributes,
                attributesById,
                { relationshipType, elementType: elementTypes.ATTRIBUTE },
            );
            const fromDataElements = replaceElementIdsWithElement(
                fromConstraint.trackerDataView?.dataElements,
                dataElementsById,
                { relationshipType, elementType: elementTypes.DATA_ELEMENT },
            );
            const toDataElements = replaceElementIdsWithElement(
                toConstraint.trackerDataView?.dataElements,
                dataElementsById,
                { relationshipType, elementType: elementTypes.DATA_ELEMENT },
            );

            return {
                ...relationshipType,
                // $FlowFixMe Might be fixable with generics
                fromConstraint: {
                    ...fromConstraint,
                    trackerDataView: {
                        attributes: fromAttributes,
                        dataElements: fromDataElements,
                    },
                },
                // $FlowFixMe Might be fixable with generics
                toConstraint: {
                    ...toConstraint,
                    trackerDataView: {
                        attributes: toAttributes,
                        dataElements: toDataElements,
                    },
                },
            };
        })
        .filter(relationshipType => relationshipType);
};
