// @flow
import type { RelationshipTypes } from '../Types';
import { mapRelationshipElementToId } from './mapRelationshipElementToId';

const elementTypes = {
    ATTRIBUTE: 'ATTRIBUTE',
    DATA_ELEMENT: 'DATA_ELEMENT',
};

type Element = {|
    id: string,
    valueType: string,
    displayName: string,
|}

type Props = {|
    relationshipTypes: RelationshipTypes,
    attributes: Array<Element>,
    dataElements: Array<Element>,
|}

export const formatRelationshipTypes = ({
    relationshipTypes = [],
    attributes,
    dataElements,
}: Props) => {
    const attributesById = attributes.reduce((acc, { id, valueType, displayName }) => {
        acc[id] = { valueType, displayName };
        return acc;
    }, {});

    const dataElementsById = dataElements.reduce((acc, { id, valueType, displayName }) => {
        acc[id] = { valueType, displayName };
        return acc;
    }, {});

    // $FlowFixMe
    return relationshipTypes
        .map((relationshipType) => {
            const { fromConstraint, toConstraint } = relationshipType;
            const fromAttributes = mapRelationshipElementToId(
                fromConstraint.trackerDataView?.attributes,
                attributesById,
                { relationshipType, elementType: elementTypes.ATTRIBUTE },
            );
            const toAttributes = mapRelationshipElementToId(
                toConstraint.trackerDataView?.attributes,
                attributesById,
                { relationshipType, elementType: elementTypes.ATTRIBUTE },
            );
            const fromDataElements = mapRelationshipElementToId(
                fromConstraint.trackerDataView?.dataElements,
                dataElementsById,
                { relationshipType, elementType: elementTypes.DATA_ELEMENT },
            );
            const toDataElements = mapRelationshipElementToId(
                toConstraint.trackerDataView?.dataElements,
                dataElementsById,
                { relationshipType, elementType: elementTypes.DATA_ELEMENT },
            );

            return {
                ...relationshipType,
                fromConstraint: {
                    ...fromConstraint,
                    trackerDataView: {
                        attributes: fromAttributes,
                        dataElements: fromDataElements,
                    },
                },
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
