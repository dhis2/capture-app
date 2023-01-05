// @flow
import { useCallback } from 'react';
import log from 'loglevel';
import { errorCreator } from 'capture-core-utils';
import { useIndexedDBQuery } from '../../../../utils/reactQueryHelpers';
import { getUserStorageController, userStores } from '../../../../storageControllers';
import { programCollection } from '../../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../../metaData';
import type { GetPrograms, RelationshipTypes } from '../../../WidgetsRelationship';

const elementTypes = {
    ATTRIBUTE: 'attribute',
    DATA_ELEMENT: 'dataElement',
};

const mapElementIdsToObject = (elementIds, elements, { relationshipType, elementType }) => {
    (elementIds || [])
        .map((elementId) => {
            const element = elements[elementId];

            if (!element) {
                log.error(
                    errorCreator(`${elementType} from relationshipType not found in cache`)(
                        { elementId, relationshipType },
                    ),
                );
                return null;
            }

            if (!element.valueType) {
                log.error(
                    errorCreator(`cached ${elementType} is missing value type`)(
                        { elementId, element }),
                );
                return null;
            }

            return {
                id: elementId,
                type: element.valueType,
            };
        })
        .filter(element => element);
};

const getRelationshipTypes = async (): Promise<RelationshipTypes> => {
    const userStorageController = getUserStorageController();
    const cachedRelationshipTypes = await userStorageController.getAll(userStores.RELATIONSHIP_TYPES);
    const attributeIds = cachedRelationshipTypes
        .flatMap((relationshipType) => {
            const { fromConstraint, toConstraint } = relationshipType;
            const fromAttributes = fromConstraint.trackerDataView?.attributes || [];
            const toAttributes = toConstraint.trackerDataView?.attributes || [];
            return [...fromAttributes, ...toAttributes];
        }).reduce((acc, attributeId) => {
            acc[attributeId] = true;
            return acc;
        }, {});

    const attributes = (await userStorageController.getAll(userStores.TRACKED_ENTITY_ATTRIBUTES, {
        predicate: ({ id }) => attributeIds[id],
        project: ({ id, valueType }) => ({ id, valueType }),
    })).reduce((acc, { id, valueType }) => {
        acc[id] = { valueType };
        return acc;
    }, {});

    const dataElementIds = cachedRelationshipTypes
        .flatMap((relationshipType) => {
            const { fromConstraint, toConstraint } = relationshipType;
            const fromDataElements = fromConstraint.trackerDataView?.dataElements || [];
            const toDataElements = toConstraint.trackerDataView?.dataElements || [];
            return [...fromDataElements, ...toDataElements];
        }).reduce((acc, dataElementId) => {
            acc[dataElementId] = true;
            return acc;
        }, {});

    const dataElements = (await userStorageController.getAll(userStores.DATA_ELEMENTS, {
        predicate: ({ id }) => dataElementIds[id],
        project: ({ id, valueType }) => ({ id, valueType }),
    })).reduce((acc, { id, valueType }) => {
        acc[id] = { valueType };
        return acc;
    }, {});

    return cachedRelationshipTypes
        .map((relationshipType) => {
            const { fromConstraint, toConstraint } = relationshipType;
            const fromAttributes = mapElementIdsToObject(
                fromConstraint.trackerDataView?.attributes,
                attributes,
                { relationshipType, elementType: elementTypes.ATTRIBUTE },
            );
            const toAttributes = mapElementIdsToObject(
                fromConstraint.trackerDataView?.attributes,
                attributes,
                { relationshipType, elementType: elementTypes.ATTRIBUTE },
            );
            const fromDataElements = mapElementIdsToObject(
                fromConstraint.trackerDataView?.dataElements,
                dataElements,
                { relationshipType, elementType: elementTypes.DATA_ELEMENT },
            );
            const toDataElements = mapElementIdsToObject(
                fromConstraint.trackerDataView?.dataElements,
                dataElements,
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
        });
};

export const useTEIRelationshipsWidgetMetadata = (): {
    getPrograms: GetPrograms,
    relationshipTypes: ?RelationshipTypes,
    isError: boolean,
} => {
    const getPrograms = useCallback((trackedEntityTypeId: string) =>
        [...programCollection.values()]
            .filter(program =>
                program instanceof TrackerProgram &&
                program.trackedEntityType.id === trackedEntityTypeId &&
                program.access.data.read,
            )
            .map(p => ({ id: p.id, name: p.name })),
    []);

    const { data: relationshipTypes, isError } =
    useIndexedDBQuery<RelationshipTypes>(
        'relationshipTypes',
        getRelationshipTypes,
    );

    return {
        relationshipTypes,
        getPrograms,
        isError,
    };
};
