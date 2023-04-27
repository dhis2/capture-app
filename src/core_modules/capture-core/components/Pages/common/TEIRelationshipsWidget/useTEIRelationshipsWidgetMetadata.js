// @flow
import { useCallback } from 'react';
import { useIndexedDBQuery } from '../../../../utils/reactQueryHelpers';
import { getUserStorageController, userStores } from '../../../../storageControllers';
import { programCollection } from '../../../../metaDataMemoryStores';
import { TrackerProgram } from '../../../../metaData';
import type { RelationshipTypes } from '../../../WidgetsRelationship';
import {
    extractElementIdsFromRelationshipTypes,
    formatRelationshipTypes,
} from '../../../WidgetsRelationship';

const getRelationshipTypes = async (): Promise<RelationshipTypes> => {
    const userStorageController = getUserStorageController();
    const cachedRelationshipTypes = await userStorageController.getAll(userStores.RELATIONSHIP_TYPES);
    const { dataElementIds, attributeIds } = extractElementIdsFromRelationshipTypes(cachedRelationshipTypes);

    const attributes = (await userStorageController.getAll(userStores.TRACKED_ENTITY_ATTRIBUTES, {
        predicate: ({ id }) => attributeIds[id],
        project: ({ id, valueType, displayName }) => ({ id, valueType, displayName }),
    })).reduce((acc, { id, valueType, displayName }) => {
        acc[id] = { valueType, displayName };
        return acc;
    }, {});

    const dataElements = (await userStorageController.getAll(userStores.DATA_ELEMENTS, {
        predicate: ({ id }) => dataElementIds[id],
        project: ({ id, valueType, displayName }) => ({ id, valueType, displayName }),
    })).reduce((acc, { id, valueType, displayName }) => {
        acc[id] = { valueType, displayName };
        return acc;
    }, {});

    return formatRelationshipTypes({
        relationshipTypes: cachedRelationshipTypes,
        attributes,
        dataElements,
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
        ['cachedRelationshipTypes'],
        getRelationshipTypes,
    );

    return {
        relationshipTypes,
        getPrograms,
        isError,
    };
};
